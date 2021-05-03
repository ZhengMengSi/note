# **Smarty模板技术**



> **思考**：为了代码能够更好的维护，我们会将PHP代码尽量从HTML中分离出来，但是不可避免的还是要在HTML中写入很多数据，这个时候依然需要用到很多PHP标签之类的，有没有更好的方式呢？

> **引入**：PHP理论上要把数据通过HTML进行渲染，所以无论如何都是会出现嵌套的，但是我们可以有更好的方式，让PHP标签不出现在HTML中，从而让HTML中的代码看上去更整洁，这个技术就是`模板技术`。模板技术有很多，但是技术比较早，也比较全面的是Smarty模板技术（ThinkPHP3框架以后也自带模板引擎）。



* 模板技术原理
* Smarty学习



> **总结**

1. 模板技术在Web编程中使用非常广泛，能够让前端界面变得非常简洁
2. Smarty模板技术功能强大，使用起来却非常方便



***



## **一、 模板技术**



> **思考**：PHP之所以能够写在HTML中，一是因为PHP本身有标签能够区分其他代码，二是因为服务器能够把各种类型的代码文件交给PHP引擎处理。如果我们在HTML中不使用PHP标签能否将PHP要展示的数据显示出来呢？

> **引入**：HTML文档实际上可以看成是一个字符串文件，那么也就可以将文档内容读入到PHP里面。因此，除了在HTML中直接写对应的PHP标签代码可以解析，我们也可以让PHP去尝试以其他的方式来实现数据在HTML里的插入，这个就得用到替换。



### **1. 模板技术原理【了解】**



> **定义**：模板技术，即利用特定的占位符放到一个文档中的某个部位，然后利用相应的方式找到对应的占位符，并将数据实现占位符替换。

1. 原来要在HTML中显示数据的方式：在PHP文件中准备好数据，然后在HTML中写一个echo指令，利用PHP文件包含HTML文件即可

```PHP
//PHP文件，获取数据，然后加载HTML文档
$var = 'hello world';

//包含HTML文件
include_once 'hello.html';
```

```php+HTML
<--!hello.html-->
<html>
    <header></header>
    <body>
        <?php echo $var;?>
    </body>
</html>
```

2. 以上方式会让HTML中嵌入很多PHP标签，从而影响文档的整体性，此时我们可以换一种思路

在HTML中要显示的数据使用一个类似HTML的标记，而并非PHP输出语句

```html
<!--hello.html-->
<html>
    <header></header>
    <body>
        {$hello}
    </body>
</html>
```

在PHP中也不再进行文件的加载，而是才有读取的形式

```PHP
$hello = 'hello world';
//读取文件
$str = file_get_contents('hello.html');
```

如果此时输出$str，那么得到的就是hello.html直接访问的结果。如果想要在{hello}处显示相应的数据，那么就需要进行占位符替换

```PHP
$hello = 'hello world';
//读取文件
$str = file_get_contents('hello.html');

//对$str中的{hello}进行替换，替换成$hello中的数据
$str = str_replace('{$hello}',$hello,$str);

//输出替换后的结果
echo $str;
```

2. 以上就是一种直接替换成成品的模板技术原理，但是实际上模板技术是要为项目服务的，以上方式虽然能解决问题，但是太过简单。比如说一个数组传入，以上方式就不合适了，所以真正的模板技术算法是比较复杂的。而且考虑到项目的效率，通常模板技术会经历以下几层方式

* 编译：对原始的PHP文件提供的内容，和HTML提供的模板进行编译，编译的结果就是形成一个可执行的PHP编译文件

```HTML
<!--原模板文件-->
<html>
    <header></header>
    <body>
        {$hello}
    </body>
</html>
```

```php+HTML
<!--编译后的文件-->
<html>
    <header></header>
    <body>
        <?php echo $hello;?>
    </body>
</html>
```

* 执行：编译后的文件就已经可以直接被PHP引擎解释执行了

```PHP
$hello = 'hello world';
//包含文件
include '模板技术编译后的PHP文件'
```



> **总结**

1. 模板技术原理的本质是在HTML中设置相对简洁的标签，然后利用PHP实现内容的替换（这个过程由程序实现，开发人员不需要管理，只需要在需要显示数据的位置使用特定的标签即可）
2. 模板技术是需要考虑项目实现和效率的，所以通常会产生中间产物（编译文件）来提升效率（后期不用再进行编译了）



***



## **二、 Smarty模板技术【掌握】**



> **思考**：模板技术能够让开发人员专注后台数据提供，而前端人员也不用因为PHP代码的各种存在而显得代码很混乱。但是如果要自己实现的话，应该要提供很多代码逻辑吧？

> **引入**：小项目的话其实不用模板引擎也可以的，毕竟任何内容的引入都会产生额外的开销（运行层）。而如果大型项目的话，肯定是需要用到模板技术来进行管理的，一般情况下我们不需要自己开发模板引擎，可以用市场上现有的成熟的模板引擎，比如`Smarty`



### **1. Smarty模板引擎介绍【了解】**

> **定义**：Smarty是一个使用PHP写出来的[模板引擎](https://baike.baidu.com/item/%E6%A8%A1%E6%9D%BF%E5%BC%95%E6%93%8E/907667)，是目前业界最著名的PHP模板引擎之一。它提供了逻辑与外在内容的分离，简单的讲，目的就是要使用php程序员同美工分离,使用的程序员改变程序的逻辑内容不会影响到美工的页面设计，美工重新修改页面不会影响到程序的程序逻辑，这在多人合作的项目中显的尤为重要。

1. Smarty是一款专门用于PHP与HTML分离的模板技术，通常不会独立工作，而是在PHP项目需要使用的时候引入使用。我们可以从[Smarty官网](https://www.smarty.net/)下载

![1536304054430](效果图\Smarty官网.png)

**注意**：Smarty从2.6.31版本开始已经是基于PHP7.2版本，所以要根据实际PHP版本来选择对应的Smarty版本

2. 任何工具的时候都可以从操作手册着手，Smarty有强大的[操作手册](https://www.smarty.net/docs/zh_CN/)，我们可以在开发的时候去寻找帮助

![1536304257390](效果图\Smarty操作手册.png)

3. 使用Smarty的优缺点

* 优点
  * 效率高，这是Smarty模板引擎特有的，可以让我们的网站访问效率提升
  * 编译型，Smarty并非简单的替换，而是对模板先进行编译，从而达到效率高（二次访问不再编译）
  * 缓存，Smarty可以直接缓存，在编译的基础上生成访问效率更高的静态页
  * 插件，允许开发人员自定义插件（通常不用）
  * 灵活，内置函数可以方便开发人员高效率实现数据显示
* 缺点
  * 数据实时效率低，如果访问数据是实时的，那么smarty会降低访问效率
  * 不适合小项目，会让项目开发难度增加，丧失PHP敏捷开发的特点



> **总结**

1. Smarty是一款致力于解决PHP和HTML分离的模板引擎
2. Smarty能够很好的提升大项目的访问效率，但是也会增加开发成本，不适合小项目和数据实时性要求高的项目



***



> **思考**：Smarty作为一款插件，该如何应用到PHP项目中来呢？

> **引入**：插件的引入其实本质与扩展类似，其核心的功能通常使用都比较方便。Smarty作为一款老资历，使用起来也不复杂



### **2. Smarty的简单使用【掌握】**



> **定义**：Smarty使用，就是将Smarty加入到项目中，并且引入到项目中实现模板替换的功能。

1. Smarty作为一款插件，可以直接放到项目的根目录，也可以根据实际项目需求，放到相应的插件目录（Vendor）。当前作为学习，我们可以直接将Smarty放到网站根目录：从官网下载，然后解压，将解压后文件夹中的libs文件夹放到网站根目录，为了方便管理可以改名为smarty文件夹（目前使用的是最新版本3.1.32）

![1536309370640](效果图\Smarty文件夹目录说明.png)

2. Smarty被引入到项目之后，我们要做的就是去包含Smarty.class.php文件，然后进行实例化

```PHP
//加载Smarty类文件，实例化
include_once 'smarty/Smarty.class.php';
$smarty = new Smarty();
```

3. Smarty的目标是将用户要显示的数据通过Smarty在模板合适的位置显示出来，这里要实现该功能一共分为三步

* 在模板中使用Smarty规则来定义数据存放占位符：默认规则是`{` + `$`  + `变量名` + `}`

```HTML
<!--smarty.html模板文件-->
<!DOCTYPE html>
<html>
<head>
	<title></title>
</head>
<body>
	{$hello}
</body>
</html>
```

* 使用Smarty::assign('模板中变量名','数据')方法将要显示的数据传递给模板

```PHP
//接Smarty实例化对象后
$smarty->assign('hello','具体数据')；
```

* 使用Smarty::display('模板文件')方法将要显示数据的模板加载显示：默认加载路径是网站根目录或者根目录下的templates文件夹

```PHP
//接smarty的assign方法后
$smarty->display('smarty.html');
```



> **总结**

1. Smarty可以直接从官网获取版本，版本使用请参照对应的PHP版本（最新版适用PHP7）
2. Smarty虽然强大，但是使用步骤非常简单

* 引入Smarty.class.php文件
* 实例化Smarty对象
* 利用smarty::assign()方法分配要给模板显示的数据
* 利用smarty::display()方法加载模板文件
* 在模板中利用smarty标记来占位数据（注意名字与assign方法分配的名字要一致，否则匹配不上）



***



> **思考**：在项目开发时，很有可能目录结构并非是Smarty默认识别的路径，那么该如何操作呢？

> **引入**：上述只是Smarty的入门，告知我们Smarty使用非常简单。而在实际开发的时候，我们可以根据项目的需求来**定制**Smarty。



### **3. Smarty配置【掌握】**



> **定义**：Smarty配置，即根据项目具体需求，来选择smarty应该怎么样去工作。

1. Smarty提供了很多配置，可以通过其Smarty对象的属性来设置。

* $smarty->debugging = false;    			  //是否开启debug调试，默认关闭
* $smarty->template_dir = "templates/";     //模板目录
* $smarty->compile_dir = "templates_c/";    //编译目录（Smarty自动创建）
* $smarty->config_dir = "configs/";                //配置项目录
* $smarty->caching = false;                            //是否开启缓存
* $smarty->cache_dir = "cache/";                   //缓存目录（开启缓存后自动创建）
* $smarty->cache_lifetime = 3600;                //缓存生命周期，单位是s
* $smarty->left_delimiter = "{";                      //左定界符
* $smarty->right_delimiter = "}";                   //右定界符

2. 最简单的使用是只需要配置一下对应的template_dir属性即可

```PHP
$smarty = new Smarty();
$smarty->template_dir = 'templates/';	//实际模板所在目录

//注意：如果指定的目录不存在，那么系统还会自动去根目录下寻找
```

3. 如果需要开启缓存，那么需要配置三项内容

```PHP
$smarty->caching = true;
$smarty->cache_dir = 'cache/';			//后两项可以默认
$smarty->cache_lifetime = 24 + 60 * 60;
```

4. 如果考虑到{}作为模板分隔符会与js冲突的话，可以修改一下

```PHP
$smarty->left_delimiter = "<{";
$smarty->right_delimiter = "}>";
```





> **总结**

1. Smarty配置提供了很多控制方式，我们可以根据自己的需求来设定控制
2. 通常使用Smarty时，需要设置的就是模板路径template_dir和可能冲突的分隔符left/right_delimiter
3. 在项目开发阶段，一般不会开启缓存模式；如果生产环境数据的变更不频繁，那么可以开启



***



## **三、 Smarty模板技术详解【掌握】**



> **思考**：Smarty中如果涉及到数组该怎么解析？是不是所有的变量，包括系统的预定义变量都需要进行assign然后才能解析？

> **引入**：Smarty针对模板中的解析变量，做了自己的解析规则，默认的处理方式的确是行不通的，需要参照Smarty制定的变量规则。



### **1. 模板变量【掌握】**



> **定义**：模板变量，即在模板中被分配的变量，以及如何使用Smarty规则在模板中解析变量。

1. 在Smarty模板中，我们将模板中的变量分为三类

* PHP分配变量，即利用assign方法分配的变量
* smarty保留变量，包括超全局预定义变量和smarty的内置变量
* 自定义变量，用户在模板中去定义变量（通常不用）

2. PHP分配变量，理论上PHP可以分配任意数据类型给模板进行解析，通常数据其实也就三种

* 标量数据：直接使用标记输出的数据
* 数组数据：在smarty模板中可以使用下标或者通过"."+下标来实现
* 对象数据：在smarty模板中也是通过对象访问符来实现访问

```PHP
//PHP给模板分配数据
$smarty->assign('str','string');
$smarty->assign('arr1',array(1,2,3));					//索引数组
$smarty->assign('arr2',array('k1'=>'v1','k2'=>'v2'));	//关联数组
class Person{
    public $name = '张三';
    public $nickname = '小三';
}
$smarty->assign('person',new Person());					//对象
$smarty->display('smarty.html');
```

```HTML
<!--smarty.html模板-->
<html>
    <header></header>
    <body>
        {*smarty的注释：标量数据，直接显示即可*}
        字符串：{$str}<br/>
        
        {*数组数据：两种下标访问方式都可以*}
        {$arr1[1]}---{$arr1.2}
        {$arr2.k1}---{$arr2['k2']}<br/>
        {*在Smarty中，"."模式用的比较多，但是一般索引数组不用点*}
        
        {*对象数据：直接按照对象访问方式访问即可*}
        {$person->name}---{$person->nickname}<br/>
    </body>
</html>
```

3. Smarty保留变量：是smarty考虑到用户会需要经常使用的系统变量，或者内部变量。这类变量通常以$smarty开始，然后是各类关键字，多次访问

* GET数据：{$smarty.get.名字}
* POST数据：{$smarty.post.名字}
* session数据：{$smarty.session.名字}
* cookie数据：{$smarty.cookies.名字}
* REQUEST数据：{$smarty.request.名字}
* server数据：{$smarty.server.大写名字}
* 时间戳：{$smarty.now}
* 模板路径：{$smarty.current_dir}
* 模板名字：{$smarty.template}
* 配置文件：{$smarty.config.配置名}

```HTML
<html>
   	<header></header>
    <body>
        {*表单传递了数据：有get和post提交，开启了session，还有携带cookie*}
      	GET数据：{$smarty.get.name}
	  	POST数据：{$smarty.post.name}
		session数据：{$smarty.session.username}
		cookie数据：{$smarty.cookies.username}
		REQUEST数据：{$smarty.request.name}
		server数据：{$smarty.server.SERVER_NAME}
		时间戳：{$smarty.now}
		模板路径：{$smarty.current_dir}
		模板名字：{$smarty.template}
    </body>
</html>
```

4. 自定义变量：Smarty为了在模板中可以灵活的对数据进行处理，允许设置变量：{assign var='变量名' value='变量值'}

```HTML
<html>
    <header></header>
    <body>
        {assign var='hello' value='world'}
        {$hello}
    </body>
</html>
```

5. 配置文件：在smarty中，提供了一种独立为Smarty提供个性化服务的配置文件。既然是模板技术，配置内容自然是为了改变模板效果。

配置文件格式：smarty的配置文件与PHP的配置文件不一样，通常可以直接使用txt格式文件。文件配置项的格式是名字 = 值，可以配置多个，#号代表注释，[局部]代表局部访问

```php
#注释：默认的，所有的配置项都是全局的：smarty_config.php
bodyBgColor = #000000

#局部配置
[customer]
pageTitle = 'Customer Info'
```

加载配置文件：当配置文件配置好之后，在模板中需要事先加载配置文件才能使用，使用{config_load file='配置文件路径' [section='局部区间']}

```HTML
{config_load file='smarty_config.php'}
<html>
    <header></header>
    <body>
    </body>
</html>
```

使用配置文件：当配置文件加载之后，smarty通过在标签内部使用一对“#”号来区分是配置文件，或者使用保留变量{$smarty.config.配置项名字}访问

```HTML
{*全局配置文件使用*}
{config_load file='smarty_config.php'}
<html>
    <header></header>
    <body bgcolor="{#bodyBgColor#}">
    </body>
</html>
```

```html
{*局部配置文件访问*}
{config_load file='smarty_config.php' section='customer'}
<html>
    <title>{$smarty.config.pageTitle}</title>
    <body>
    </body>
</html>
```





> **总结**

1. Smarty提供了多种在模板中显示数据的方式

* PHP分配变量，在PHP中通过assign方法分配对的变量，在模板中直接使用
* 内置变量，Smarty将各类系统超全局变量的内部实现，通过`$smarty.超全局变量名[小写].数组元素下标`访问
* 自定义变量，在模板中可以通过{assign var='变量名' value='值'}设定变量，并进行访问
* Smarty允许对模板进行配置，可以通过smarty配置文件，{config_load file="文件名" [section='具体配置部分']}的形式将配置文件引入到模板中，然后使用配置标签{#配置项#}或者保留变量{$smarty.config.配置项}来事项访问



***



> **思考**：如果在模板中要批量显示数据，并且涉及一定的逻辑关系，那么我们该怎么处理呢？

> **引入**：数据动态化的显示是PHP作为动态网站开发语言的最典型特征，为了保证PHP的数据能够在HTML中尽可能方便的显示，Smarty提供了一套内置函数用来实现数据的复杂化处理。



### **2. 内置函数【掌握】**



> **定义**：Smarty内置函数，是Smarty针对分支、循环等数据处理语句封装的一套便于在模板中显示和操作数据的语法格式。

1. 分支处理：Smarty中提供了一套if分支用于简单逻辑判定，语法格式为{if}{elseif}{else}{/if}

```HTML
<html>
    <header></header>
    <body>
        {if isset($smarty.post.username)}
        	{$smarty.post.username}
        {else}
        	没有输入用户名
        {/if}    
    </body>
</html>
```

2. 循环处理：PHP最核心的一点就是数据的批量输出，在Smarty中提供了多种遍历输出数组数据的方式

* foreach：遍历所有类型数组，主要用户PHP分配的数据的输出显示

```HTML
<html>
    <header></header>
    <body>
        {形式1：采用foreach固有形式}
        {foreach $arr as $val}
        	{*显示$val的数据*}
        {/foreach}
        
        {*形式2：采用smarty专属形式*}
        {foreach from=$arr key='键名字' item='值名字'}
        	{*可以访问键名字和值*}
        	{$键名字}{$值名字}
        	
        	<!--以下方式也能取得键名-->
        	{$值名字@key}						
        {/foreach}
    </body>
</html> 
```

**注意1**：在Smarty中，为foreach提供了很多可访问属性，通过{$smarty.foreach.foreach名字.属性}或者{$循环值@属性}来实现访问

| 名字      | 含义                                                         |
| --------- | ------------------------------------------------------------ |
| index     | 当前数组索引（循环内部）                                     |
| iteration | 当前循环的次数（循环内部）                                   |
| first     | 首次循环（循环内部）                                         |
| last      | 最后一次循环（循环内部）                                     |
| show      | 循环是否执行判定：true表示循环有数据，false表示没有数据（未执行） |
| total     | foreach执行的总次数（循环内外都可以使用）                    |

```HTML
<html>
    <header></header>
    <body>
        {assign var='user' value=array('username','age','gender')}
        <table border=1>
           {foreach $user as $value}
        	{if $value@first} 第一次执行循环：
                <tr>
                    <th>下标</th>
                    <th>循环次数</th>
                    <th>值</th>
                </tr>
        	{/if}
            <tr>
                <td>{$value@index}</td>
                <td>{$value@iteration}</td>
                <td>{$value}</td>
            </tr>
        {/foreach} 
        {if $value@show} 循环有数据，一共循环了{$value@total}次{/if}
        </table> 
    </body>
</html>
```

**注意2**：foreach还允许使用一种特定方式来处理foreach遍历的数组不存在的情况，使用{foreachelse}

```html
<html>
    <header></header>
    <body>
       	{foreach from=$arr item='val'}
        	{$val}
        {foreachelse}
        	没有数据o(╥﹏╥)o
       	{/foreach}
    </body>
</html>
```

* section：遍历索引数组，通常更多的是用于没有分配数据的循环

```HTML
<html>
    <header></header>
    <body>
    {section name=任意名字 loop=传递数组|指定循环次数 [step=步长] [max=最大循环次数]}
        {$传递数组[section名字].遍历的元素下标}
    {/section}
        
    {assign var='arr' value=array(1,2,3,4,5,6)}
    {section name='id' loop=$arr max=4}
        {$arr[id]}										
    {/section}
    </body>
</html>
```

**注意**：与foreach一样，section也有很多属性，访问方式是{$smarty.section.section名字.属性}

| 名字       | 含义                                                         |
| ---------- | ------------------------------------------------------------ |
| index      | 当前数组索引（循环内部，受start和step影响）                  |
| index_prev | 当前数组索引的前一个索引（受start和step影响）                |
| index_next | 当前数组索引的后一个索引（受start和step影响）                |
| iteration  | 当前循环的次数，不受section的start和step影响，代表循环次数   |
| first      | 首次循环，布尔值（循环内部）                                 |
| last       | 最后一次循环，布尔值（循环内部）                             |
| rownum     | iteration别名                                                |
| loop       | 最后一次循环的下标（循环内外都可以使用）                     |
| show       | 循环是否执行判定：true表示循环有数据，false表示没有数据（未执行） |
| total      | section执行的总次数（循环内外都可以使用）                    |

3. 文件包含：PHP实际开发中，为了维护的方便，会将模板或者其他文件拆分成多个，此时就需要用到文件的包含来使得最终模板完整。{include file='模板文件'}，将另外一个模板文件包含进来（通常是一部分）

```html
<div class='order'>
   <!--菜单部分-->
</div>
```

```html
<html>
    <header></header>
    <body>
        <!--菜单部分-->
        {include file='order.html'}
        <!--主体部分-->
        <!--页脚部分-->
    </body>
</html>
```

4. 前端语法保护：smarty用到的标签很有可能与css样式和js冲突，此时smarty会错误的认为js或者css是smarty语法，而尝试去解析，这个时候就会报错。因此smarty提供了一种语法保护的方式，将可能冲突的部分包含起来，从而smarty不去解析：{literal}{/literal}

```html
<html>
    <header></header>
    <body>
        <div>
            <a href="javascript:show()">点我</a>
        </div>
        {literal}
        <script>
            function show(){
                alert('hello world');
            }
        </script>
        {/literal}
    </body>
</html>
```



> **总结**

1. Smarty内置函数是指在模板中可以直接使用标签代替的形式去达到对应的效果
2. Smarty中内置的函数有很多，常用的有以下几个：

* 分支处理：{if}{elseif}{else}{/if}
* 循环处理：{foreach from=数据源 item=值变量}{/foreach}
* 循环处理：{section name=名字 loop=数据源/循环次数}{/section}
* 文件包含：{include file='路径'}
* 语法保护：{literal}{/literal}

3. Smarty内置函数循环处理有很多的属性，可以方便我们在进行表格处理、数据统计时作为数据支持



***



> **思考**：模板最终是由Smarty来进行加载编译处理，那如果有些功能是Smarty本身没有做支持的，那么我们要如何实现呢？

> **引入**：Smarty毕竟是一种模板技术，不可能做的跟PHP一样强大（会显得很笨重），因此Smarty提供了一种在模板内部使用用户代码的功能。



### **3. 外部函数使用【了解】**



> **定义**：所谓外部函数使用，是指Smarty没有内置相应的函数，或者用户在PHP中自定义了一些函数，此时需要在模板中使用到。

1. 系统函数使用：在模板中如果想要使用PHP系统函数，因为smarty的加工处理，所以需要对函数使用一个相应的边界符{}来包裹

```HTML
<html>
    <header></header>
    <body>
        字符串abcdefg一共有{strlen('abcdefg')}个字节
    </body>
</html>
```

2. 自定义函数使用：用户自定义的函数使用，与系统函数一样

```PHP
//实例化Smarty
include 'smarty/Smarty.class.php';
$smarty = new Smarty();

//自定义函数：也可以定义在smarty实例化之前，只需保证smarty加载模板之前已经进入内存即可
function show(){
    echo __FUNCTION__;
}

$smarty->display('smarty.html');
```

```HTML
<html>
    <header></header>
    <body>
        {show()}
    </body>
</html>
```



> **总结**：Smarty中允许在模板中使用相应的系统函数和用户自定义函数，使用对应的smarty边界符标记好即可