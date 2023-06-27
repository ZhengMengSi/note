public class HelloWorld {
    int x;

    public static void main(String[] args) {
        HelloWorld d = new HelloWorld();
        d.x = 5;
        show(d);
        System.out.println(d.x);
    }

    public static void show(HelloWorld d) {
        d.x = 6;
    }
}