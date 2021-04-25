# **MVC自定义框架**



> **思考**：在以前的代码中我们不难发现，为了实现功能，我们的代码写的很随意，不受任何约束；所有的代码都需要从最基本单元累积，没有任何支撑（代码复用）。实际开发中是这样的方式的吗？

> **引入**：编程早期时，确实如此，所有的功能都是从无到有慢慢写出来的。因为那时候即便是完全相同的功能，在不同电脑上就得有不同的代码。而随着时间推移，随着项目需求越多，项目实现越来越大，就诞生了这样一种技术：`框架技术`



## **1. 框架技术【了解】**



> **定义**：框架技术，是指利用某种编程语言设计出来的，一种能够约束后续代码书写规范，同时还能对功能开发具有一定支撑性的代码结构。

1. 框架说明：通俗的理解，就是框架会将很多底层的代码写好，然后规范开发者具体要做的事情（通常围绕业务展开）

* 利于实现代码复用（事实上大量代码复用）
* 提升开发效率
* 开发人员可以更多关注当前要实现的功能，而不需要关注底层实现
* 规范开发人员在限定的区域里展开自己的业务代码实现

2. 框架规范：框架基本都是基于面向对象的编程语言才有，目前PHP的框架也都是基于MVC思想设计，核心的方式都是封装好相应的安全、权限以及底层实现，开发人员只需要将业务模块按需填充代码即可（MVC即可）。

* 已完成部分：底层架构已经完全实现
  * 路由设计：用户访问URL
  * MVC底层：DAO设计、公共模型设计、公共控制器设计、视图设计、模板技术实现
  * 安全设计：权限管理设计
  * 插件设计：各类插件设计（验证码、文件上传、验证规则等）
* 待完成部分：业务功能需要开发者自己完成
  * 数据库设计
  * 视图设计（前端人员）
  * 控制器设计
  * 模型设计
  * 按需配置（利用框架提供的配置，选择性配置）

3. PHP成熟的框架有很多，项目可以根据实际的需求来选择对应的框架，目前市面最常见的PHP框架有以下几个：

* ThinkPHP：目前已到5版本，中文操作手册，非常受欢迎
* Laravel：组件型框架，设计思想先进，但是比较笨重
* CI：轻量型框架，非常简单
* YII：重量级框架，也是基于组件



> **总结**

1. 框架开发是一种快速开发模式
2. 框架会提供成熟的设计模式，优良的结构，完整的底层设计，开发人员只需要针对业务开展设计即可
3. 常见的框架有很多，但都是基于MVC思想实现的



***



> **思考**：框架已经将底层都搭建好了，开发的时候都是根据具体业务写部分代码，那么如何了解一个框架的底层是如何实现的呢？

> **引入**：一个底层框架的实现，自然是有一套设计逻辑。学习一个框架首先是要知道怎么去使用框架解决问题，然后再深入框架是如何实现，学习其设计思路。这里，我们可以先模拟一个简单的框架底层实现，这样对后续框架的学习和使用就很有帮助了。



## **2. MVC自定义框架分析【掌握】**



> **定义**：MVC自定义框架，是基于MVC设计思想下，实现项目单一入口为基准的简单框架，有了该框架，我们就可以在后续的项目中，使用事先设计的框架进行快速开发了。

1. 框架结构设计

* 框架是基于MVC设计
* 框架是项目单一入口，即所有浏览器发起的请求（无论是用户主动还是被动）都是请求入口文件
* 数据库操作部分DAO使用PDO的二次封装实现
* 视图操作借助于Smarty实现
* 公共控制器处理公共业务代码
* 公共模型处理公共数据操作代码
* 整个框架自动加载

2. 框架设计思路如下

![MVC项目单一入口框架](效果图\MVC项目单一入口框架.gif)



> **总结**

1. 项目单一入口是基于MVC设计思想存在
2. 核心内容依然是MVC设计思想
3. 入口部分强制规定只能是一个入口文件，所有请求都必须请求同一个入口文件，入口文件可以将功能进行分类管理
4. 理论上讲：所有文件的相对路径都是入口文件所在目录，所有PHP文件都是被index.php入口文件所包含使用的（言外之意，前面所定义的所包含的内容，在后面的文件里都可以使用，注意顺序即可）



***



> **思考**：既然有一个对应的框架的设计思路了，那么代码到底该如何设计实现呢？

> **引入**：其实一个软件的设计实现还是有很多种方式的，最基本也是最简单的一种方式，就是从代码的运行轨迹开始去设计，这样的思路就比较清晰，也方便随时进行测试验证。



## **3. MVC自定义框架设计【掌握】**



> **定义**：MVC自定义框架设计就是按照设计思路，顺着代码的执行顺序去逐步编码，先实现简单的、必须的逻辑代码，后期发现有新的需求，可以回头增加对应的功能（不是修改）。具体的思路我们可以按照根据设计的结构性来划分成多个部分

* 项目目录结构
* 入口+初始化部分
* 控制器部分
* 模型部分
* DAO重用部分
* Smarty插件部分
* 代码测试



### **3.1 项目目录结构设计【掌握】**



> **定义**：项目目录结构是代码开始前最先设计的部分，规定代码的工作和存储位置，也代表未来访问路径

1. 通常一个基于MVC的项目单一入口有以下目录结构

* /：网站设计根目录
  * public：公共资源目录（网站访问根目录），包括入口文件，静态资源（CSS/Javascript/Image）
  * app：应用目录，存放MVC代码
    * admin：后台部分
      * controller：存放业务控制器，带admin\controller命名空间
      * model：存放业务模型，带admin\model命名空间
      * view：存放视图模板
    * home：前台部分
      * controller：存放业务控制器，带home\controller命名空间
      * model：存放业务模型，带home\model命名空间
      * view：存放视图模板
  * config：配置目录，存放各类配置文件
  * core：核心目录，存放核心文件，如初始化文件、公共控制器、公共模型等，带core命名空间
  * vendor：第三方应用目录，如smarty等



> **总结**

1. 网站根目录是指设计的结构根目录，而网站对外的站点可以设置为根目录下的public文件夹（实际网站根目录），这样可以从服务器角度防止用户访问其他PHP文件
2. app目录作为开发者最核心的目录，框架完成后，开发者只要做的就是在app各个目录中写入代码
3. 如果前后台能够共用的模型代码很多（理论上都是操作同样的表，只要数据操作方式一样即可），可以合并放到app目录下



***



### **3.2 入口文件设计【掌握】**



> **定义**：入口文件，包含两个部分，第一个是用户访问的入口，以及入口进入MVC之前所要做的初始化工作。

1. 增加入口文件：在public目录（对外网站根目录）下增加一个入口index.php文件
2. 思考：如何区分用户是访问的index.php然后再由index.php去访问其他的文件的呢？可以在index.php中增加一个记号，如果是index.php包含的其他文件，那么可以判定记号是否存在即可。

```PHP
//index.php

//增加入口记号：定义常量，以后其他文件判定是否有该常量
define('ACCESS',TRUE);	
```

3. 入口文件通常不做其他事情，只是定义一个入口记号，以及调用初始化文件即可：初始化文件是一个非常核心的文件，会被放到core目录下，可以直接叫App.php（注意：是个类文件，只是现在很多地方已经不再明确使用class后缀了）

```PHP
//接以上代码

//要包含初始化文件：App.php是在index.php的 ../core/ 下，所以包含的时候要注意，为了方便可以使用常量来进行访问
define('ROOT_PATH',__DIR__ . '/../');			//这个常量在后面还会用到
require ROOT_PATH . 'core/App.php';		

//激活初始化文件：因为App.php在core目录下，带core命名空间，所以使用完全限定名称访问
\core\App::start();									//APP类下有静态方法start()
```

**注意**：到此，入口文件就做完了，以后也不会再去改变，就是目前这个样子



4. 增加/core/App.php初始化文件

```PHP
//增加命名空间
namespace core;
```

5. 如何确认来访问App.php文件的是index.php？通过index.php中的记号来判定

```PHP
//确认访问正确
if(!defined('ACCESS')){
    //没有定义ACCESS常量：非正常访问
    header('location:../public/index.php');
    exit;
}
```

6. 创建初始化类App，增加入口方法start()

```PHP
//初始化类
class App{
    public static function start(){
        
    }
}
```

7. 由于站点对外根目录和实际开发文件所在目录并非同一目录，也因为文件在不同文件夹，相对目录的包含存在不确定性，所以需要很多文件的包含使用绝对路径，因此，需要为后续需要进行文件包含的文件夹建立绝对路径，通常以常量保存。路径常量设定属于一类独立的功能，因此要创建一个独立的方法来设定。

```PHP
//路径常量方法
private static function set_path(){
    //定义不同路径常量：核心目录、App目录、控制器目录、模型目录、视图目录、扩展目录
    define('CORE_PATH',		ROOT_PATH . 'core/');
    define('APP_PATH',		ROOT_PATH . 'app/');
    define('HOME_PATH',		APP_PATH . 'home/');
    define('ADMIN_PATH',	APP_PATH . 'admin/');
    define('ADMIN_CONT',	ADMIN_PATH . 'controller/');
    define('ADMIN_MODEL',	ADMIN_PATH . 'model/');
    define('ADMIN_VIEW',	ADMIN_PATH . 'view/');			//如果使用Smarty加载，意义不大
    define('HOME_CONT',		HOME_PATH . 'controller/');
    define('HOME_MODEL',	HOME_PATH . 'model/');
    define('HOME_VIEW',		HOME_PATH . 'view/');
    define('VENDOR_PATH',	ROOT_PATH . 'vendor/');
    define('CONFIG_PATH',	ROOT_PATH . 'config/');
    define('URL','http://www.mvc.com/');			
    //如果框架设计够大够全，还有一些目录常量需要配置
}
//在start()入口方法中调用该方法
public static function start(){
    //定义目录常量
    self::set_path();
}
```

8. 很多公司有多个项目，生产环境和开发环境在一台服务器上，此时生产环境需要屏蔽错误，而开发环境需要暴露错误，通过修改php.ini配置文件显然不合适，所以通常会在项目中进行当前项目的系统错误控制，利用ini_set('配置项','值')来实现。既然是要做框架，就要考虑到这些，而控制这块作为一个独立的方法.

```PHP
//增加错误控制方法
private static function set_error(){
    //错误类型和错误处理方式
    @ini_set('error_reporting',E_ALL);	//E_ALL为系统常量，表示所有错误
    @ini_set('displary_errors',1);		//显示错误信息
}
```

9. 在实际开发中，肯定有很多的东西是不确定的或者可以外部更改的（理论上讲，目录结构、系统控制也是允许外部修改的），此时就需要配置成相应的配置文件来实现。然后我们在初始化的时候读取配置文件，以供后续使用

```PHP
//读取配置文件
private static function set_config(){
    //配置文件不是在当前方法中使用，也未必是在当前类中使用，所以需要涉及成全局的
    global $config;
    $config = include CONFIG_PATH . 'config.php';
}
```

**注意**：为了让代码能够正确跑起来，我们需要在/config/config.php中创建对应文件并进行相关配置（暂时可以不配置）

```PHP
//config.php
return array(
	//数据库配置
    'database'=> array(
        'type' => 'mysql',		//数据库产品
    	'host' => 'localhost',
        'port' => '3306',
        'user' => 'root',
        'pass' => 'root',
        'charset' => 'utf8',
        'dbname'  => 'test',
        'prefix'  => ''			//表前缀
    ),

	//其他配置
);
```

10. 初始化文件完成初始化功能后，最重要的一件事就是将URL解析，并且找到合适的控制器以及对应的控制器方法：此时，我们就规定浏览器在进行服务器访问的时候，必须携带具体的控制器名字和相应的方法名字（如果有分组，那么还需要分组信息）。

```PHP
//解析URL
private static function set_url(){
    //获取前后台、控制器名字和方法名字：规定浏览器参数中携带p参数、c参数和a参数（p代表platform平台，c代表controller，a代表action）
    $p = $_REQUEST['p'] ?? 'home';			//默认前台
    $c = $_REQUEST['c'] ?? 'Index';			//默认IndexController
    $a = $_REQUEST['a'] ?? 'index';			//默认index方法
    
    //暂时只是解析，不分发，考虑到后续还要使用，设定为常量
    define('P',$p);
    define('C',$c);
    define('A',$a);
}
```

11. 所有的类文件都在控制器、模型和核心文件夹中，所以应该定义多个类来实现类的自动加载。但是所有的类文件都有命名空间，所以要考虑到命名空间的影响。利用spl_autoload_register()方法实现注册

```PHP
//四种不同文件夹的类加载方法
private static function set_autoload_function($class){
    //此时$class不只是类名，是带着空间的，所以只保留类名
    $class = basename($class);
    
    //核心类加载
    $path = CORE_PATH . $class. '.php';				//核心类全路径
    if(file_exists($path)){
        include_once $path;
    }
    
    //前台控制器和模型加载
    if(P == 'home'){
        $path = HOME_CONT . $class . '.php';
        if(file_exists($path)){
            include_once $path;
        }
        
        $path = HOME_MODEL . $class . '.php';
        if(file_exists($path)){
            include_once $path;
        }
    }else{
        //后台
        $path = ADMIN_CONT . $class . '.php';
        if(file_exists($path)){
            include_once $path;
        }
        
        $path = ADMIN_MODEL . $class . '.php';
        if(file_exists($path)){
            include_once $path;
        }
    }
   
    
    //外部类加载
    $path = VENDOR_PATH . $class . '.php';
    if(file_exists($path)){
        include_once $path;
    }
    
    //如果都加载不到，就让系统报错
}

//新建一个方法，让个性化的自动加载注册到自动加载机制
private static function set_autoload(){
    spl_autoload_register(array(__CLASS__,'set_autoload_function'));
}

```

12. 解析的目的是为了实现控制器的方法，因此需要进行控制器分发工作

```PHP
//分发控制器
private static function set_dispatch(){
    //分发之前要找到对应的控制器名字和方法名字
    $p = P;
    $c = C;
    $a = A;
    
    //我们后面会规定控制器必须带Controller名字结尾，模型必须带Model结尾，即IndexController，所以需要补充名字
    $c .= 'Controller';					//控制器全名
    
    //注意有命名空间，所以访问上要使用空间访问
    $spacename = "\\$p\\controller\\$c";
    $obj = new $spacename();
    $obj->$a();							//可变方法
}
```

12. 完善初始化类的start()方法

```PHP
public static function start(){
    //路径常量
    self::set_path();
    //系统设置
    self::set_error();
    //配置文件
    self::set_config();
    //url解析
    self::set_url();
    //分发控制器
    self::set_dispatch();
}
```

13. 为了完成测试，需要在控制器文件夹/app/controller/下创建一个默认控制器和默认方法

```PHP
//命名空间
namespace home\controller;

class IndexController{
    //默认方法
    public function index(){
        echo '欢迎来到MVC项目单一入口自定义框架！';
    }
}
```



> **总结**

1. 单一入口为index.php，所有请求都要只能访问index.php文件，并且要携带控制器和方法信息（平台）
2. 初始化文件要实现较多功能（非MVC逻辑）

* 目录常量
* 系统设置
* 配置文件
* 自动加载
* URL解析
* 分发控制器

3. 在复杂灵活的框架中，目录常量、系统设置都会添加到配置文件中，方便开发者管理；同时还会增加多种URL解析方式，并在配置文件中提供配置方式选择



***



### **3.3 公共控制器【掌握】**



> **定义**：公共控制器，即所有控制器都会用到（或者大部分会用到）的方法，此时需要在公共控制器中存在，然后让普通控制器继承公共控制器即可。

1. 定义公共控制器：公共控制器不属于具体业务控制器，属于一定会用到的控制器，因此要存放到/core/目录下

```PHP
//公共控制器
namespace core;				//所有core文件夹下的类都属于core空间

class Controller{
    
}
```

2. 公共控制器是用来解决公共问题的方法，让子类直接调用的。如果涉及到一些需要初始化才能访问的，那么就会在公共控制器中创建构造方法来实现（构造方法子类也可以继承，对象实例化自动调用，省去调用方法的麻烦）

```PHP
//构造方法
public function __construct(){
    
}
```

3. 控制器要使用Smarty模板技术，这是所有控制器都要使用的，所以应该在公共控制器中实现，一上来就可以实现对smarty的实例化。同时要保证子类对象的可访问，就需要增加属性保存smarty对象

```PHP
//增加属性：只有子类内部访问
protected $smarty;
//构造方法实例化Smarty
public function __construct(){
    //引入smarty：假设在vendor/smarty/Smarty.class.php中
    include VENDOR_PATH . 'smarty/Smarty.class.php';
    $this->smarty = new \Smarty();				//要是完全限定名称访问
    //设置Smarty
    $this->smarty->template_dir = VIEW_PATH;
    $this->smarty->caching = false;				//开发阶段不缓存
    $this->smarty->cache_dir = ROOT_PATH . 'cache';
    $this->smarty->cache_lifetime = 120;
   	$this->smarty->compile_dir = ROOT_PATH . 'template_c';
}
```

4. 以上虽然实例化了smarty但是会发现要使用smarty必须$this->smarty->方法来进行访问，如果想让smarty的使用变得轻松，可以对控制器要访问的smarty的主要方法assign和display进行二次封装

```PHP
//smarty的二次封装
protected function assign($key,$value){
    //调用smarty实现
    $this->smarty->assign($key,$value);
}

protected function display($file){
    $this->smarty->display($file);
}

//封装后，子类控制器继承后，就可以直接使用$this->assign(key,value)了
```

5. 为了保证smarty能够正常运行，需要将smarty下的libs文件夹移动到vendor目录下，并且改名为smarty

![smarty在MVC自定义框架](效果图\smarty在MVC自定义框架.png)

6. 实际上，大项目里视图会有很多，如果统一放到view文件夹下，会让维护成本增加（同名？），所以一般会在view下创建对应控制器名字相同的文件夹，里面放对应控制器的视图

![1536931135074](效果图\MVC自定义框架视图分层.png)

**所以**：此时要在Smarty加载模板时，将对应控制器的路径加入（这一在子类控制器调用视图时，只要传入对应的名字即可

```PHP
//修改smarty的template_dir属性
$this->smarty->template_dir = APP_PATH . P . '/view/' . C . '/';	//C代表控制器名字

```

7. 控制器中最常见出现的公共方法：错误提示和成功提示

```PHP
//成功提示
/*
 * @param1 string $msg，提示信息
 * @param2 string $a，跳转的目标方法，默认是当前访问方法（A常量是在初始化过程中设定的：变化越多的在越靠前）
 * @param3 string $c，跳转的目标控制器，默认是当前控制器（C常量与C常量同时定义的）
 * @param4 string $p，跳转的前后台，默认是当前平台
 * @param4 int $time，等待时间，默认3秒
*/
protected function success($msg,$a = A,$c = C,$p = P,$time = 3){
    $refresh = 'Refresh:' . $time . ';url=' . URL . 'index.php?c=' . $c . '&a=' . $a . '&p=' . $p;
    header($refresh);
    echo $msg;
    exit;
    
    //如果有成功提示模板，那么可以调用模板
    /*
    $this->assign('msg',$msg);
    $this->assign('c',$c);
    $this->assign('a',$a);
    $this->assign('time',$time);
    $this->display(成功提示模板路径);
    */
}

//错误提示：如果没有成功和失败不同的模板，那么可以success和error是一个方法
protected function error($msg,$a = A,$c = C,$p = P,$time = 3){
    $refresh = 'Refresh:' . $time . ';url=' . URL . 'index.php?c=' . $c . '&a=' . $a . '&p=' . $p;
    header($refresh);
    echo $msg;
    exit;   
}
```

8. 公共控制器需要被控制器继承，所以所有的控制器都必须引入公共控制器，并且继承在公共控制器

```PHP
//home/IndexController.php文件
//命名空间
namespace home\controller;
//引入公共控制器
use \core\Controller

class IndexController extends Controller{
    //默认方法
    public function index(){
        echo '欢迎来到MVC项目单一入口自定义框架！';
    }
}
```



> **总结**

1. 公共控制器（基类控制器）是用来处理控制器的公共代码复用部分的，放在核心文件夹中
2. 公共控制器是在子类控制器被初始化类分发之后再继承的，所以前面所有的定义的常量都是可以直接使用的
3. Smarty作为一种公共控制器插件，应该在公共控制器中实现初始化调用，子类就可以直接使用
4. Smarty如果要实现子类$this直接访问，那么就需要在公共控制器中进行二次封装。要不然就得使用属性保存smarty对象，然后在子类中使用链式访问（连贯操作）$this->smarty->assign()
5. 复杂的公共控制器中会有很多公共方法，甚至还有有多层（IndexController extends Controller extends Base）



***



### **3.4 DAO设计【掌握】**



> **定义**：DAO数据访问对象，是专门用来操作数据库的底层设计，就是负责数据库的连接认证以及SQL执行

1. DAO属于数据库底层操作，几乎每次都要用到，属于核心类

```PHP
//DAO
namespace core;

class Dao{
    
}
```

2. 使用PDO作为二次封装对象实现数据库操作，因为PDO属于全局空间，因此要在此类开始之前引入PDO的三个类

```PHP
//DAO
namespace core;
use \PDO;
use \PDOStatement;
use \PDOException;
```

3. 实现PDO的初始化，直接在构造方法中完成即可，但是需要增加一个属性用来保存PDO对象（跨方法使用）

```PHP
//属性
private $pdo;

//构造方法（传统模式，不走单例）
public function __construct($dbinfo = array()){
    $type 		= $dbinfo['type'] ?? 'mysql';
    $host 		= $dbinfo['host'] ?? 'localhost';
    $port 		= $dbinfo['port'] ?? '3306';
    $user 		= $dbinfo['user'] ?? 'root';
    $pass 		= $dbinfo['pass'] ?? 'root';
    $dbname 	= $dbinfo['dbname'] ?? 'test';
    $charset 	= $dbinfo['charset'] ?? 'utf8';
    //注意：表前缀是在模型中去组织SQL使用，而DAO只负责执行，所以不用
    
    //实例化
    try{
        $this->pdo = new PDO($type . ':host=' . $host . ';port=' . $port . ';dbname=' . $dbname,$user,$pass);
        //异常模式处理
        $this->pdo->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
    }catch(PDOException $e){
        echo '数据库连接失败！<br/>';
        echo '错误文件为：' . $e->getFile() . '<br/>';
        echo '错误行为：' . $e->getLine() . '<br/>';
        echo '错误描述为：' . $e->getMessage() . '<br/>';
        exit;
        
        //最好使用模板输出信息，而不是直接描述错误
    }
}
```

4. 接下来就是SQL执行了，所有的SQL执行都是有可能出错的，所以我们可以封装好SQL验证处理

```PHP
//SQL执行错误处理：捕捉PDOException的异常即可
private function dao_exception($e){
    echo 'SQL执行错误！<br/>';
    echo '错误文件为：' . $e->getFile() . '<br/>';
    echo '错误行为：' . $e->getLine() . '<br/>';
    echo '错误描述为：' . $e->getMessage() . '<br/>';
    exit;  
}
```

5. 字符集处理

```PHP
//字符集处理
private function dao_charset($charset = 'utf8'){
    try{
        $this->pdo->exec($charset);
    }catch(PDOException $e){
        $this->dao_exception($e);
    }
}

//然后在构造方法中，调用对应的方法即可
public function __construct($type = 'mysql',$dbinfo = array()){
    //初始化置换后
    $this->dao_charset($charset);
}
```

6. 封装写方法

```PHP
//写操作
public function dao_exec($sql){
    try{
        //调用PDO::exec方法执行
        return $this->pdo->exec($sql);
    }catch(PDOException $e){
        //调用自己封装的异常处理方法
        $this->dao_exception($e);
    }
}

//附带自增长ID
public function dao_insert_id(){
    return $this->pdo->lastInsertId();
}
```

7. 封装读方法：分两种模式读取：一条和多条

```PHP
//读操作：默认读一条
public function dao_query($sql,$all = false){
    try{
        //调用PDO::query方法执行
        $stmt = $this->pdo->query($sql);
        
        //解析数据
        if($all){
            return $stmt->fetchAll(PDO::FETCH_ASSOC);	//统一为关联数组获取
        }else{
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }
    }catch(PDOException $e){
        $this->dao_exception();
    }
}
```

8. 完成本地测试：暂时没有模型，无法实现整体测试，先简单测试

```PHP
//就在当前Dao.php类外

$dao = new Dao();
$res = $dao->dao_query('select * from 表名');
$res = $dao->dao_exec('delete from 表名 limit 1');
var_dump($res);
```





> **总结**

1. DAO作为最底层的SQL执行者，存放到core文件夹中，使用二次封装PDO完成
2. DAO的封装可以根据业务的需求进行复杂度提升，如预处理、事务处理等



***



### **3.5 公共模型【掌握】**



> **定义**：控制器是MVC中唯一一个必须被访问的文件，而模型和视图并非一定要存在（框架并不需要完成具体业务），因此我们在搭建框架时，只需要把公共模型搭建好即可，所有的模型都继承自公共模型。

1. 公共模型是所有模型必须使用的，也不带具体业务逻辑，所以属于核心文件

```PHP
//core/Model.php
namespace core;

class Model{}
```

2. 公共模型要实现通过DAO操作数据库，所以在Model类中，要实现Dao的初始化

```PHP
namespace core;
//use \core\Model;	//注意Dao和Model类同属于core空间，所以不引入是OK的

class Model{
    //保存Dao对象
    protected $dao;
    
    //初始化Dao
    public function __construct(){
        //实例化数据库操作：需要用到配置文件
        global $config;
        $this->dao = new Dao($config['database']);
    }
}
```

3. 作为基础模型，自然是需要为子类提供最方便的访问，所以也可以对Dao的方法进行"借壳"，即取名同名方法，然后让子类可以直接使用$this->方法名()方法

```PHP
//写方法
protected function exec(string $sql){		    //这个是在子类模型中调用
    return $this->dao->dao_exec($sql);
}
//获取ID
public function getLastId(){			//这个是可能控制器调用
    return $this->dao->dao_insert_id();
}

//读方法
protected function query(string $sql,$only = true){
    return $this->dao->dao_query($sql,$only);
}
```

4. 作为公共控制器务必要为子类模型提供一些共性的方法，如后无条件查询表中所有数据，根据ID查询数据，组装全表名等

```PHP
//构造表名：规定在子类中必须定义一个受保护的属性protected $table保存表名，不带前缀
protected function getTable(string $table = ''){	//允许模型调用时传入不同的表名（多表查询）
    global $config;
    $table = empty($table) ? $this->table : $table;
    
    return $config['database']['prefix'] . $table;
}

//若要能够根据主键查询数据，通常需要知道主键是什么，所以在一开始就就需要定义对应的属性来保存
protected $fields = array();
//在构造方法实现表全部字段的获取（或者单独创建方法，在构造方法中调用，很有意义的）
private function getFields(){
    $sql = 'desc ' . $this->getTable();
    $res = $this->query($sql,true);					//得到一个二维数组
    
    foreach($res as $value){
        $this->fileds[] = $value['Field'];			//保留所有字段名字
        
        //判定主键
        if($value['Key'] == 'PRI'){
            $this->fields['key'] = $value['Field'];	//主键额外再存一个
        }
    }
}//需要在构造方法中调用该方法（该方法私有，必须在父类里面访问）
public function __construct(){
    //在实现初始化之后
    $this->getFields();
}

//根据ID查询数据
public function getById(int $id){
    //组织SQL
    $sql = "select * from {$this->getTable()} where {$this->fields['key']} = {$id}";
    return $this->query($sql);
}
```



> **总结**

1. 公共模型主要对接DAO和子类模型
2. 公共模型要实现Dao类的实例化操作，如果为了子类操作方便不需要使用链式操作$this->dao->方法名()，可以对Dao中的方法进行二次封装
3. 公共模型可以为子类模型提供必要的公共方法（复杂的会有跟多的方法）

* 组件完整表名
* 获取表字段信息（包括主键）
* 获取全部数据
* 通过ID获取数据



***



### **3.6 整体测试【了解】**



前面已经对控制器部分进行了测试，现在只需要将模型部分加入到框架中即可

1. 在/app/home/model/下增加一张表对应的模型

```PHP
//表模型
namespace home\model;
use \core\Model;

class TableModel extends Model{
    protected $table = '表名';
}
```

2. 在控制器中增加调用模型的代码

```PHP
//home/IndexController控制的index方法
public function index(){
    $m = new \model\TableModel();
    $res = $m->getById(1);
    var_dump($res);
}
```



> **总结**

1. 简单的框架体系就完成了，当然还有很多内容需要我们去完善才能成为框架
2. 如果在测试的过程中，有任何问题，可以及时调整，确保整条线MVC可以跑通
3. 重量级的框架会提供页面静态化、伪静态等高级操作，这个在后续学习框架中会了解到（并非所有框架有）