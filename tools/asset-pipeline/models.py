"""Original parametric meshes. Units: metres, Z up, face toward -Y. No external assets."""
import math
import numpy as np
TAU=math.tau
class Mesh:
    def __init__(self): self.vertices=[]; self.faces=[]; self.colors=[]
    def add(self, verts, faces, color):
        offset=len(self.vertices); self.vertices.extend(verts)
        for f in faces:
            self.faces.append([offset+i for i in f]); self.colors.append(color)
    def ellipsoid(self, pos, size, color, rings=12, sides=20):
        v=[]; f=[]
        for j in range(rings+1):
            a=math.pi*j/rings
            for i in range(sides):
                b=TAU*i/sides;v.append([pos[0]+size[0]*math.sin(a)*math.cos(b),pos[1]+size[1]*math.sin(a)*math.sin(b),pos[2]+size[2]*math.cos(a)])
        for j in range(rings):
            for i in range(sides):
                a=j*sides+i;b=j*sides+(i+1)%sides;c=b+sides;d=a+sides;f.extend([[a,b,c],[a,c,d]])
        self.add(v,f,color)
    def tube(self,a,b,r,color,r2=None,sides=20):
        a=np.array(a); b=np.array(b); axis=b-a;axis=axis/np.linalg.norm(axis)
        u=np.cross(axis,[0,0,1] if abs(axis[2])<.9 else [0,1,0]);u/=np.linalg.norm(u);w=np.cross(axis,u)
        v=[];f=[]
        for p,radius in [(a,r),(b,r if r2 is None else r2)]:
            for i in range(sides): v.append(p+radius*(u*math.cos(TAU*i/sides)+w*math.sin(TAU*i/sides)))
        v.extend([a,b])
        for i in range(sides):
            j=(i+1)%sides;f.extend([[i,j,j+sides],[i,j+sides,i+sides],[2*sides,j,i],[2*sides+1,i+sides,j+sides]])
        self.add(v,f,color)
    def line(self,points,r,color):
        for a,b in zip(points,points[1:]):self.tube(a,b,r,color)
        for p in points:self.ellipsoid(p,[r,r,r],color,6,10)
    def fin(self,points,thickness,color):
        v=[[x+dx,y,z] for dx in [-thickness,thickness] for x,y,z in points]
        self.add(v,[[0,1,2],[3,5,4],[0,3,4],[0,4,1],[1,4,5],[1,5,2],[2,5,3],[2,3,0]],color)

WOOD=[.63,.34,.14];SKIN=[.87,.64,.43];WHITE=[.95,.93,.83];DARK=[.10,.13,.14];PINK=[.87,.31,.51];BLUE=[.12,.39,.89]
def eyes(m,positions,r=.11):
    for x,y,z in positions:
        m.ellipsoid([x,y,z],[r,r*.56,r*1.2],WHITE)
        m.ellipsoid([x+.012,y-r*.5,z],[r*.45,r*.24,r*.66],DARK)
        m.ellipsoid([x-.02,y-r*.71,z+r*.3],[r*.13,r*.09,r*.17],[1,1,1],6,10)
def shoe(m,x,y,z):
    m.ellipsoid([x,y-.07,z],[.17,.30,.09],WHITE)
    m.ellipsoid([x,y-.055,z+.08],[.155,.265,.115],BLUE)
    for i in range(3):m.tube([x-.09,y-.10+i*.07,z+.17],[x+.09,y-.10+i*.07,z+.17],.015,WHITE,sides=8)
    m.ellipsoid([x,y+.13,z+.17],[.095,.075,.04],DARK)
def build(character, phase=None):
    m=Mesh()
    if character=='tung':
        m.tube([0,0,.55],[0,0,1.9],.30,WOOD,r2=.34,sides=40)
        m.ellipsoid([0,0,1.9],[.34,.34,.07],[.77,.48,.24])
        for i in range(26):
            a=TAU*i/26;r=.304
            pts=[[math.cos(a)*r,math.sin(a)*r,.65],[math.cos(a+.025)*.319,math.sin(a+.025)*.319,1.2],[math.cos(a)*.338,math.sin(a)*.338,1.86]]
            m.line(pts,.006,[.40,.22,.095] if i%3 else [.81,.52,.28])
        for i,x in enumerate([-.17,.17]):
            swing=0 if phase is None else math.sin(phase+i*math.pi)
            stride=swing*.15+(0 if phase is None else .025*math.cos(phase+i*math.pi)); lift=max(0,swing)*.12
            m.line([[x,0,.65],[x*1.1,stride*.45,.31+lift*.4],[x*1.3,-.05+stride,.12+lift]],.065,WOOD)
            m.ellipsoid([x*1.3,-.16+stride,.075+lift],[.115,.22,.075],WOOD)
        m.line([[-.30,0,1.25],[-.48,-.05,.90],[-.48,-.17,.70]],.067,WOOD)
        m.line([[.30,0,1.25],[.49,-.10,1.02],[.67,-.18,1.15]],.07,WOOD)
        m.tube([.66,-.18,.67],[.66,-.18,1.72],.07,[.42,.22,.085],r2=.10)
        m.ellipsoid([.66,-.18,1.72],[.10,.10,.09],[.47,.26,.11])
        eyes(m,[[-.13,-.315,1.53],[.13,-.315,1.53]],.117)
        m.ellipsoid([0,-.36,1.32],[.07,.08,.10],WOOD)
        m.line([[-.12,-.327,1.17],[0,-.353,1.13],[.13,-.327,1.20]],.018,DARK)
        for x in [-.13,.13]:m.line([[x-.1,-.32,1.72],[x,-.35,1.75],[x+.08,-.32,1.72]],.022,[.30,.16,.07])
    elif character=='shark':
        gray=[.30,.52,.63]
        m.ellipsoid([0,0,.78],[.37,.72,.38],gray,18,28)
        m.ellipsoid([0,-.53,.72],[.32,.38,.24],gray)
        m.ellipsoid([0,-.42,.60],[.30,.43,.125],WHITE)
        m.fin([[0,-.08,1.03],[0,.18,1.63],[0,.40,1.0]],.055,gray)
        m.tube([0,.46,.77],[0,1.03,.84],.23,gray,r2=.065)
        m.fin([[0,.95,.83],[0,1.35,1.23],[0,1.20,.48]],.045,gray)
        for side in [-1,1]:
            m.fin([[side*.24,-.1,.77],[side*.79,.23,.49],[side*.27,.40,.64]],.05,gray)
        for i,(x,y) in enumerate([(-.34,-.30),(.34,-.30),(0,.54)]):
            swing=0 if phase is None else math.sin(phase+i*TAU/3)
            stride=swing*.23;lift=max(0,swing)*.16
            m.line([[x*.8,y,.66],[x,y+stride*.4,.40+lift*.5],[x,y+stride,.22+lift]],.074,gray)
            shoe(m,x,y+stride,.11+lift)
        eyes(m,[[-.23,-.738,.84],[.23,-.738,.84]],.085)
        m.line([[-.23,-.78,.62],[0,-.92,.60],[.23,-.78,.62]],.022,DARK)
        for x in [-.14,-.07,0,.07,.14]:m.tube([x,-.869+abs(x)*.3,.63],[x,-.869+abs(x)*.3,.57],.022,WHITE,r2=.002,sides=6)
        for s in [-1,1]:
            for i in range(3):m.line([[s*.337,-.25+i*.09,.91],[s*.364,-.23+i*.09,.77]],.011,[.16,.32,.39])
    elif character=='croc':
        green=[.29,.43,.19];metal=[.42,.49,.38]
        m.ellipsoid([0,0,.73],[.25,.89,.24],green,16,24)
        m.ellipsoid([0,-.78,.75],[.29,.39,.23],green)
        m.ellipsoid([0,-1.08,.67],[.245,.43,.115],[.41,.55,.25])
        m.ellipsoid([0,-1.06,.55],[.235,.42,.055],[.68,.70,.40])
        eyes(m,[[-.17,-.87,.94],[.17,-.87,.94]],.075)
        for x in [-.14,.14]:m.ellipsoid([x,-1.4,.73],[.04,.05,.025],DARK)
        for s in [-1,1]:
            for i in range(6):m.tube([s*.22,-.81-i*.10,.62],[s*.22,-.81-i*.10,.55],.022,WHITE,r2=.001,sides=6)
            m.add([[s*.1,-.25,.72],[s*1.3,.24,.66],[s*1.33,.51,.65],[s*.10,.30,.65]],[[0,1,2],[0,2,3]],metal)
            m.ellipsoid([s*.70,.05,.66],[.12,.36,.13],green)
            m.tube([s*.70,-.33,.66],[s*.70,-.40,.66],.055,DARK)
            m.tube([s*.70-.22,-.40,.66],[s*.70+.22,-.40,.66],.022,metal)
            m.tube([s*.70,-.4,.46],[s*.70,-.4,.86],.02,metal)
            m.add([[0,.6,.80],[s*.56,.97,.78],[s*.5,1.09,.77],[0,.9,.78]],[[0,1,2],[0,2,3]],metal)
        m.fin([[0,.55,.85],[0,.98,1.23],[0,1.08,.79]],.035,metal)
        for i in range(7):m.ellipsoid([0,-.44+i*.16,.98],[.055,.06,.06],[.46,.60,.25],6,10)
    elif character=='cup':
        ceramic=[.92,.83,.67]
        m.tube([0,0,1.35],[0,0,1.92],.265,ceramic,r2=.35,sides=40)
        m.ellipsoid([0,0,1.92],[.35,.35,.045],WHITE)
        m.ellipsoid([0,0,1.949],[.303,.303,.012],[.34,.17,.07])
        # Latte rosetta, authored as small pale raised leaves.
        for i in range(5):
            for s in [-1,1]:m.ellipsoid([s*(.025+i*.022),.13-i*.058,1.963],[.035+i*.009,.026,.003],[.93,.79,.52],6,12)
        m.tube([0,.16,1.965],[0,-.16,1.965],.009,WHITE,sides=8)
        m.line([[.31,0,1.8],[.49,0,1.83],[.58,0,1.68],[.53,0,1.48],[.28,0,1.43]],.06,ceramic)
        m.ellipsoid([0,0,1.02],[.17,.135,.34],PINK)
        m.tube([0,0,.72],[0,0,1.0],.43,[.97,.52,.66],r2=.13,sides=48)
        for i in range(20):
            a=TAU*i/20;m.tube([.13*math.cos(a),.13*math.sin(a),.99],[.44*math.cos(a),.44*math.sin(a),.72],.016,[.96,.66,.75],sides=8)
        if phase is None:
            m.line([[-.08,0,.75],[-.11,0,.40],[-.08,-.02,.12]],.047,SKIN)
            m.line([[.08,0,.75],[.25,.02,.43],[.37,.0,.58]],.047,SKIN)
            m.ellipsoid([-.08,-.055,.08],[.06,.10,.12],PINK)
            m.ellipsoid([.39,-.025,.60],[.08,.09,.06],PINK)
        else:
            for i,x in enumerate([-.10,.10]):
                swing=math.sin(phase+i*math.pi);stride=.14*swing+.025*math.cos(phase+i*math.pi);lift=max(0,swing)*.13
                m.line([[x,0,.75],[x*1.2,stride*.6,.40+lift*.5],[x,stride,.13+lift]],.047,SKIN)
                m.ellipsoid([x,stride-.07,.09+lift],[.065,.13,.08],PINK)
        m.line([[-.12,0,1.15],[-.35,-.03,1.25],[-.48,-.08,1.56]],.043,SKIN)
        m.line([[.12,0,1.15],[.36,-.10,1.03],[.53,-.14,1.19]],.043,SKIN)
        eyes(m,[[-.115,-.294,1.69],[.115,-.294,1.69]],.075)
        for s in [-1,1]:
            m.line([[s*.18,-.29,1.75],[s*.22,-.31,1.8]],.015,DARK)
        m.line([[-.065,-.282,1.48],[0,-.298,1.46],[.065,-.282,1.49]],.013,[.55,.19,.25])
    elif character=='chaos':
        purple=[.58,.40,.76]; pale=[.76,.59,.9]
        m.ellipsoid([0,0,.83],[.34,.26,.46],purple)
        for i in range(9):
            a=i*TAU/9;m.ellipsoid([math.cos(a)*.24,math.sin(a)*.18,1.22+(.05 if i%2 else 0)],[.16,.14,.16],pale if i%2 else purple)
        for i,x in enumerate([-.17,.17]):
            swing=0 if phase is None else math.sin(phase+i*math.pi+.25*i)
            lift=max(0,swing)*(.14 if i else .1);y=swing*.17
            m.line([[x,0,.57],[x*1.3,y*.5,.3+lift*.4],[x*1.5,y,.11+lift]],.065,purple)
            m.ellipsoid([x*1.5,y-.09,.08+lift],[.12,.18,.07],purple)
        for side in [-1,1]:m.line([[side*.28,0,.96],[side*.43,-.01,.72],[side*.54,-.09,.76]],.065,pale)
        eyes(m,[[-.12,-.25,1.02],[.12,-.25,1.02]],.09)
        m.line([[-.1,-.264,.81],[0,-.29,.78],[.1,-.264,.82]],.018,DARK)
        m.ellipsoid([0,0,1.53],[.11,.08,.04],[.75,.94,.45])
    if phase is not None and character=='croc':
        # Aircraft: no walking legs. Pre-render a subtle roll/pitch hover cycle.
        v=np.asarray(m.vertices);roll=.045*math.sin(phase);pitch=.025*math.cos(phase)
        v[:,0]+= (v[:,2]-.73)*math.sin(roll);v[:,2]+=v[:,0]*math.sin(roll)+v[:,1]*math.sin(pitch)
        m.vertices=v.tolist()
    return m
