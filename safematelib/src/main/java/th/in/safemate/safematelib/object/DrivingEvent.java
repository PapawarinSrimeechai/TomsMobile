package th.in.safemate.safematelib.object;

/**
 * Created by thuny on 05/09/2016.
 */
public class DrivingEvent {

    private int b = 0, sb = 0, a = 0, sa = 0;
    private int l = 0, sl = 0, r = 0, sr = 0, cl = 0, scl, cr = 0, scr, u = 0, su = 0;
    private int overspeedLimit = 0;

    public DrivingEvent() {
    }

    public void setB() {
        this.b = b + 1;
    }

    public void setSb() {
        this.sb = sb + 1;
    }

    public void setA() {
        this.a = a + 1;
    }

    public void setSa() {
        this.sa = sa + 1;
    }

    public void setL() {
        this.l = l + 1;
    }

    public void setSl() {
        this.sl = sl + 1;
    }

    public void setR() {
        this.r = r + 1;
    }

    public void setSr() {
        this.sr = sr + 1;
    }

    public void setCl() {
        this.cl = cl + 1;
    }

    public void setScl() {
        this.scl = scl + 1;
    }

    public void setCr() {
        this.cr = cr + 1;
    }

    public void setScr() {
        this.scr = scr + 1;
    }

    public void setU() {
        this.u = u + 1;
    }

    public void setSu() {
        this.su = su + 1;
    }

    public void setOverspeedLimit() {
        this.overspeedLimit = overspeedLimit + 1;
    }

    public int getB() {
        return b;
    }

    public int getSB() {
        return sb;
    }

    public int getA() {
        return a;
    }

    public int getSA() {
        return sa;
    }

    public int getL() {
        return l;
    }

    public int getSL() {
        return sl;
    }

    public int getR() {
        return r;
    }

    public int getSR() {
        return sr;
    }

    public int getCl() {
        return cl;
    }

    public int getSCL() {
        return scl;
    }

    public int getCr() {
        return cr;
    }

    public int getSCR() {
        return scr;
    }

    public int getU() {
        return u;
    }

    public int getSu() {
        return su;
    }

    public int getOverspeedLimit() {
        return overspeedLimit;
    }
}
