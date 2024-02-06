# Golang语言基础

## 基础语法要点

1. rune

2. complex 复数

   ```go
   func euler() {
     cmplx.Exp(1i * math.Pi) + 1
     // cmplx.Pow(math.E, 1i * math.Pi) + 1
   }  
   ```


3. 强制类型转换: 所有的转换必须显式声明

  - 整数转换为浮点数: 浮点数不能精确表示所有的数, 比如, 他有可能没有办法精确的表示3

  - 浮点数转换为整数: 4.99999会被转换为4而不是5, 解决方案并没有一个通用的办法, 而是要具体问题具体分析。一般的, 把结果四舍五入, 使用math.Round, 然后再转整数就可以了。

  - 由于浮点数本身无法精确表示一个数, 所以这个问题无法完美解决。在精度要求高的场合, 我们采用定点数, 比如go语言有big.Float

4. 枚举: go没有特殊的枚举关键字, 一般就使用const来定义

   ```go
   const （
     cpp = iota // 自增
     _
     java
     python
     golong
     javascript
   ）
   ```


5. 文件读取

   ```go
   func main（） {
     const filename = "abc.txt"
     contents, err = ioutil.ReadFile(filename)
     if err != nil {
       fmt.Println(err)
     } else {
       fmt.Println("%s\n", contents)
     }
   }
   
   func printFile(filename string) {
     file, err := os.Open(filename)
     if err != nil {
       panic(err)
     }
     scanner := bufio.NewScanner(file)
     
     for scanner.Scan() {
       fmt.Println(scanner.Text())
     }
   } 
   ```


6. switch: go中switch不需要break, 除非使用fallthrough, 同时switch后可以没有表达式

7. for的条件里不需要括号, 条件可以省略初始条件, 结束条件, 递增表达式。没有while

   ```go
   func convertToBin(n int) string {
     result := ""
     for ; n > 0; n /= 2{
       lsb := n % 2
       result = strconv.Itoa(lsb) + result
     }
     return result
   }
   ```


8. go语言的指针是不能计算的。数组是值类型, 通常不使用, 而使用切片。

## 面向对象

### 结构体

1. go语言仅支持封装, 不支持继承和多态

2. go语言没有class, 只有struct。只有使用指针才可以改变内容, nil指针也可以调用方法。

   ```Go
   type treeNode struct {
     value int
     left, rigth *treeNode
   } 
   
   func createNode(value int) *treeNode {
     return &treeNode{value: value}
   }
   
   // 为结构定义方法
   func (node treeNode) print() {
     fmt.Print(node.value)
   }
   
   // 使用指针作为方法接收者
   func (node *treeNode) setValue(value int) {
     node.value = value
   }
   
   func main() {
     var root treeNode
     root = treeNode{value : 3}
     root.left = treeNode{}
     root.right = treeNode{5, nil, nil}
     
     // nodes := []treeNode {
     //   {value: 3},
     //   {},
     //   {6, nil, nil},
     // }
     
     root.right.left = new(treeNode)
     // 使用工厂函数进行定义, 返回了局部变量的地址
     root.right.right = createTreeNode(2)
     
     root.print()
     root.left.setValue(4)
     
     
   } 
   ```


### 接口

接口即描述了一个方法能做什么事情, 也即不再关心实现类的具体实现

 ```Go
 func getRetriever() retriever {
   return testing.Retriever{}
 } 
 
 type retriever interface {
   Get(string) string
 } 
 
 func main() {
   var r retriever = getRetriever()
   fmt.Println(r.Get("url"))
 } 
 ```


#### duck typing

"像鸭子走路, 像鸭子叫（长得像鸭子）, 那么就是鸭子。"

描述事物的外部行为而非内部结构

严格来说go属于结构化类型系统, 类似duck typing

**Go语言的接口是由使用者定义, 并由使用者决定使用哪个实现类**, 与java的由实现类实现者告知使用者的方式有较大逻辑上的区别。 

#### interface {}

类似于泛型, 在type后类型的部分接interface{}表达为不限定类型

#### Go语言标准接口

1. Stringer: 同等于Java的 toString

2. Reader和Writer: 不仅可以读写文件, 还可以读写网络

## 函数式编程

> 函数式编程更加强调程序执行的结果而非执行的过程，倡导利用若干简单的执行单元让计算结果不断渐进，逐层推导复杂的运算，而不是设计一个复杂的执行过程。在函数式编程中，函数是第一类对象（一等公民），意思是说一个函数，既可以作为其它函数的输入参数值，也可以从函数中返回值，被修改或者被分配给一个变量。


> 个人理解: 函数式编程的要点就在于, 将功能尽可能的包装成一个函数, 通过返回值或者其他语言中的类似于回调函数的概念, 进行嵌入。


   ```go
   package main
   
   import (
       "fmt"
       "strings"
       "io"
       "bufio"
     )
   
   // 功能函数封装
   type intGen func() int
   
   // 功能实现函数
   func fibonacci() intGen {
     // 自由变量, 类似于初始化
     a, b := 0, 1
     return func () int {
       // 局部变量
       a, b = b, a + b
       return a
     }
   }
   
   // 实现intGen下的Read接口, 实现生产者
   func (g intGen) Read(p []byte) (n int, err error ){
     next := g()
     if next > 10000 {
       return 0, io.EOF
     }
     s := fmt.Sprintf("%d\n", next)
     return strings.NewReader(s).Read(p)
   }
   
   // 将实现的Read接口提供给消费者
   func printFileContents(reader io.Reader) {
     scanner := bufio.NewScanner(reader)
   
     for scanner.Scan() {
       fmt.Println(scanner.Text())
     }
   }
   
   func main() {
     // 创建实现函数
     f := fibonacci()
     // 使用实现接口
     printFileContents(f)
   }
   ```


## 错误处理与资源管理

### defer调用

1. 确保在函数结束时发生

2. 多个defer的执行顺序是先进后出

    ```Go
    func writeFile(filename string) {
      file, err := os.Create(filename)
      if err != nil {
        panic(err)
      }
      defer file.Close()
      
      writer := bufio.NewWriter(file)
      defer writer.Flush()
      
      f := fib.Fibonacci()
      for i :=0; i < 20; i++ {
        fmt.Fprintln(writer, f())
      }
    } 
    ```


### 错误处理

1. error: 本身是一个类型, 和int, string等没有什么区别

2. 可以通过err.(*os.PathError)来获取 err的详细信息

   ```Go
   if err != nil {
     if pathError, ok := err.(*os.PathError); !ok {
       panic(err)
     } else {
       fmt.Printf("%s, %s, %s\n",
         pathError.Op,
         pathError.Path,
         pathErrpr.Err)
     }
     return
   } 
   ```


3. 自定义err, `err = errors.New("error message")`

4. 服务器统一处理

   ```go
   package main 
   
   import (
     "net/http"
     "os"
     "io/ioutil"
   ) 
   
   // 通过url获取文件
   func main() {
     // 获取url
     http.HandleFunc("/list/", 
       // res和req
       func(writer http.ResponseWriter, 
         request *http.Request) {
           // 获取文件信息
           path := request.URL.Path[len("/list/"):]
           // 获取相应文件, 开启文件流
           file, err := os.Open(path)
           if err != nil {
             // 普通err打印
             panic(err)
             // 网络异常打印
             http.Error(writer,
                 err.Error(), 
                 http.StatusInternalServerError)
             // 网络异常改, 保护了内部的错误信息不会往外传递
             switch {
             case os.IsNotExist(err):
               log.Warn("Error handling request: %s", 
                 err.Error())
               http.Error(
                 writer, 
                 http.StatusText(http.StatusNotFound),
                 http.StatusNotFound
               )
             }
             return
           }
           // 关闭文件流
           defer file.close()
           
           // 读入文件流
           all, err := ioutil.ReadAll(file)
           if err != nil {
             panic(err)
           }
           
           // 写入response
           writer.Writer(all)
         })
         
       err := http.ListenAndServe(":8888", nil)
       if err != nil {
         panic(err)
       }
   } 
   ```


5. error也是可以往外扔的, 接收的函数用errWrapper（fn()）接。

6. panic: 会停止当前函数, 并一直向上返回, 执行每一层的defer。如果没遇见recover, 程序就退出

7. recover: 仅在defer调用中使用, 获取panic的值, 如果无法处理可重新panic

### 性能调优

1. go test -bench . -cpuprofile cpu.out测试, 获取性能数据

   ```go
   func BenchmarkSubstr(b *testing.B) {
     // b.N 系统设定值
     for i:=0; i< b.N; i ++ {}
     //重置计时器, 可以用来排除准备用代码的运行时间
     b.ResetTimer()
   }
   ```


2. go tool pprof cpu.out 查看性能日志文件,  cpu.out就是性能日志文件

3. (pprof) web 需要安装Graphviz

## Channel

 ```go
 func createWorker(id int) chan int {
   c := make(chan int)
   go func() {
     for {
       fmt.Printf("Worker %d received %c\n", id, <-c)
     }
   }()
   return c
 }
 
 func chanDemo() {
   var channels [10]chan<- int
   for i := 0; i < 10; i++ {
     channels[i] = createWorker(i)
   }
   for i := 0; i < 10; i++ {
     channels[i] <- 'a' + 1
   }
   time.Sleep(time.Millisecond)
 } 
 
 func main() {
   chanDemo()
 } 
 ```


channel也是一等公民, 可以类似于变量被使用

### 缓冲channel

 ```Go
  func bufferedChannel() {
    c := make(chan int, 3)
    go worker(0, c)
    c <- 1
    c <- 2
    c <- 3
  }
 ```


### 关闭channel

 ```go
 func worker(id int, c chan int) {
   for {
     n ,ok := <-c
     if !ok {
       break
     }
     fmt.Printf("Worker %d received %d\n", id, n)
   }
 }
 
 // 发送方close, 接受方进行检测
 func channelClose() {
   c := make(chan int, 3)
   go worker(0, c)
   c <- 1
   c <- 2
   c <- 3
   close(c)
 }
 ```


### Select调度

 ```go
 select {
   case n := <-c1:
     fmt.Println("Received from c1:", n)
   case n := <-c2:
     fmt.Println("Received from c2:", n)
   default:
     fmt.Println("No value received")
 }
 ```



