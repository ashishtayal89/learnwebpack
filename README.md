# Webpack Fundamentals Course

**This course is out of date.**

Webpack is now version 2, this course was built on version 1. Although most of the content of the course is still applicable, several small items have changed and will break through the course if you follow along. Notes to fix some of the issues follow here in this readme.

## Recent Updates

Babel has undergone a major revision since the course was recorded. Because of this, you'll have to make a couple simple changes for babel to work properly. This only matters if you are using the latest versions of babel, and not the ones shown in the course. If using the versions shown in the course, you can ignore this.

In the "Using Loaders" clip, Babel is introduced. You'll need to make the changes here:

1) when installing babel-core & babel-loader with npm, you will also need to install babel-preset-es2015. Either add it to your npm install command or the following command will do this:

`npm install babel-preset-es2015 --save-dev`

2)Create a .babelrc file and give it the following contents:

`{"presets": ["es2015"]}`

You can download the .babelrc file from this repository to use if you want. Also, a fully working package.json file has been included in the repository if you want to download and use it.

Also, there are 2 differences in technical implementation in Webpack 2.
1) webpack.config.js module "loaders" is now "rules" in Webpack 2 and "pre" and "post" loaders go in the "rules" section using "enforce" as "pre" or "post"
2) the v1 version of extract-text-webpack-plugin is not compatible with WebPack 2 and the syntax is different for using it. As of today, the v2 of the plugin is in beta but I successfully installed it and used it to process SASS/CSS in a separate bundle.
Finally, when adding jshint-loader in the Using Preloaders clip, you'll need to add an empty set of curly braces to .jshintrc:  
`{}`
  
This will prevent the jshint-loader module from erroring out.

### preLoader property no longer exists

The property preLoader no longer exists for the webpack configuration file. You will receive this error:
[```configuration.module has an unknown property 'preLoaders'.```]
A solution to this problem here:
http://stackoverflow.com/questions/39668579/webpack-2-1-0-beta-25-error-unknown-property-postloaders

So the code:
```javascript
module.exports = {
    entry: ["./utils", "./app.js"],
    output: {
        filename: "bundle.js"
    },
    watch: true,

    module: {
        preLoaders: [
            {
                test: /\.js$/, // include .js files
                exclude: /node_modules/, // exclude any and all files in the node_modules folder
                loader: "jshint-loader"
            }
        ],
        loaders: [
            {
                test: /\.es6$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
    },
    resolve: {
        extensions: ['.js','.es6']
    }
}
```
Should now look like this:
```javascript
module.exports = {
    entry: ["./utils", "./app.js"],
    output: {
        filename: "bundle.js"
    },
    watch: true,

    module: {
        loaders: [
            {
                test: /\.es6$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "jshint-loader",
                enforce: 'pre'
            }
        ]
    },
    resolve: {
        extensions: ['.js','.es6']
    }
}
```
(thank you to James Daniel)


# Basic

A step by step guide

## Introduction

### The Need for a build tool

What are the issues for which we need a build tool?

- **Perfomance Issues** :
    1. Multiple web request => This can create a latency since not all the web request are async.
    Solution : **This can be resolved by combining multiple resources into one** and serving it to the browser.
    2. Code size => Is the size(MB's) is to large then it would take more time to load hence creating the latency.
    Solution : To avoid this we **minify the code**.

- **File Order Dependencies** :
    Browsers load and execute files in the order they are specified in the HTML. Through this we can guarantie that one file executes before another. But we still need to specify the order of the files to resolve the interdependency. This can get painfull if the project size increases and the number of files becomes to large.
    Solution :
    1. To use a framework like **Angular** where the order of files doesn't mater.
    2. To resolve this issue we can use the **node or ES6 modular system** which helps us to specify in each file which other files it depends on.

- **Not all browser support the latest JS versions** : 
    Not all the browsers are compatible with the latest JS versions like ES6 and furter. Hence it becomes important for us to provide the compatible versions of JS to the browser. 
    Solution : **Transpilation** helps us to convert 1 version of JS to another version. It not only transpiles between different version but also compiles the code writen in languages like Typescript and Coffeescript into Javascript code.  

- **Codeing standards** :
    It can be very easy to escape the coding standards/rules in a big team and the code can get messed up.
    Solution : Using the **linting** rules we can put a check that the rules are being followed. Sometimes the IDE like VS Code or Atom can do linting for us, but it can be easily skipped if a developer has not configured his IDE to do so.

What are the thing we generaly handle in a build system?

1. Combining files
2. Minifying files
3. Maintain file order
4. Transpiling
5. Linting

### Other Solutions

- Server side Tools : 
    1. Asp.Net bundling features
    2. Rails pipeline in Ruby on Rails

    These tools can handle combining/bundling files, minification. But they can't do ~~transpiling~~, ~~file order dependency~~ and may or maynot do linting.

- Task Runners :
    1. Grunt 
    2. Gulp 

    They are a lot more general purpose. Developers have implemented build systems using them. They are used to build task and run them based on conditions. So they can handle a lot more than just handling build. Like :
    1. They can automate the test and run them whenever code changes.
    2. Help a new developer install and run the project.
    With their plugin system they can acconplish pritty mush everything a build tool can and much more. But it is comparitively much easier to setup a build tool like webpack that setting up a task runner just for the purpose of build.
    <img width="507" alt="screen shot 2018-09-01 at 11 01 40 pm" src="https://user-images.githubusercontent.com/12914629/44948446-0ed5db80-ae3b-11e8-9924-23f129883691.png">
    In this image the task runner first lints => transpiles => Combines => minifies and then servers it to the browser.
    If your are using a module system you can use a plugin to resolve that OR you can use a framework like Angular. For example a lot of people use browserify to resolve file dependencies along with a task runner.

### Webpack Solutions

- Differences compared to a Task Runner :

    1. A build tool is very different to a task runner and is specilised/optimised only for handling a specific task ie processing input files into output files. It uses components called as **loaders** which accept source files and produce output files.

    2. It does primarily the same task as a task runner ie lints => transpiles => Combines => minifies but it also gives an additional feature of combining the css into your Js file. Similar things can be done by HTML fragments Images and fonts.
    <img width="500" alt="screen shot 2018-09-01 at 11 12 42 pm" src="https://user-images.githubusercontent.com/12914629/44948541-8eb07580-ae3c-11e8-9047-ca705b063d5a.png">

- **Webpack Conventions**

    1. Uses NPM not Bower to load all client side assets.

    2. Works with all 3 module systems :
        1. An ES2015 import statement
        2. A CommonJS require() statement
        3. An AMD define and require statement
    
### Module Systems 

Webpack helps us figure out the order in which the modules or files which need to be loaded. In the below diagram the concerts.js depends upon Bands.js, Backbone.js, Lodash.js. But the Bands.js itself depends upon Backbone and Lodash. So the webpack would load these 2 files first and then Bands.
<img width="508" alt="screen shot 2018-09-01 at 11 37 41 pm" src="https://user-images.githubusercontent.com/12914629/44948707-0f24a580-ae40-11e8-8d88-be6930ac6b3c.png">

There might be a situation where you could create cicular dependecy like in the imgae below. In this case the webpack would exit throwing a ciclular dependency error.

<img width="507" alt="screen shot 2018-09-01 at 11 38 14 pm" src="https://user-images.githubusercontent.com/12914629/44948708-1c419480-ae40-11e8-9074-e76925de32e7.png">     

## Basic Build with Webpack

