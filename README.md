# Webpack Fundamentals Course

**This course is out of date.**

Webpack is now version 2, this course was built on version 1. Although most of the content of the course is still applicable, several small items have changed and will break through the course if you follow along. Notes to fix some of the issues follow here in this readme.

## Recent Updates

Babel has undergone a major revision since the course was recorded. Because of this, you'll have to make a couple simple changes for babel to work properly. This only matters if you are using the latest versions of babel, and not the ones shown in the course. If using the versions shown in the course, you can ignore this.

In the "Using Loaders" clip, Babel is introduced. You'll need to make the changes here:

1. When installing babel-core & babel-loader with npm, you will also need to install babel-preset-es2015. Either add it to your npm install command or the following command will do this:

`npm install babel-preset-es2015 --save-dev`

2. Create a .babelrc file and give it the following contents:

`{"presets": ["es2015"]}`

You can download the .babelrc file from this repository to use if you want. Also, a fully working package.json file has been included in the repository if you want to download and use it.

Also, there are 2 differences in technical implementation in Webpack 2.
1. Webpack.config.js module "loaders" is now "rules" in Webpack 2 and "pre" and "post" loaders go in the "rules" section using "enforce" as "pre" or "post"
2. The v1 version of extract-text-webpack-plugin is not compatible with WebPack 2 and the syntax is different for using it. As of today, the v2 of the plugin is in beta but I successfully installed it and used it to process SASS/CSS in a separate bundle.
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

## MODULE 1 : Introduction

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

## MODULE 2 : Basic Build with Webpack

### CLI

- `npm i webpack -g` => Install webpack globally.
- Now create an app.js file and run `webpack ./app.js bundle.js` to build the app.js input file to bundle.js output file.

<img width="509" alt="screen shot 2018-09-02 at 1 12 26 am" src="https://user-images.githubusercontent.com/12914629/44949358-5c5b4400-ae4d-11e8-9275-3f75004f6c6b.png">

- Now you could just create an index.html file and include this bundle.js file in it. 

<img width="518" alt="screen shot 2018-09-02 at 1 14 53 am" src="https://user-images.githubusercontent.com/12914629/44949373-9cbac200-ae4d-11e8-8cdd-6d8228cefe5c.png">

- You would notice that there is a lot of code in the bundle.js which is injected by webpack.

<img width="513" alt="screen shot 2018-09-02 at 1 17 25 am" src="https://user-images.githubusercontent.com/12914629/44949398-fae7a500-ae4d-11e8-846f-da55ec9872bc.png">

### Adding a config file

We can achieve the same result as we have in the case of CLI build by using a configuration file for the build. For this :
1. Create a webpack.config.js file.
2. Add an entry level file `./app.js`
3. Add an output file `bundle.js` as below.

<img width="244" alt="screen shot 2018-09-02 at 1 31 06 am" src="https://user-images.githubusercontent.com/12914629/44949478-e4424d80-ae4f-11e8-99b1-05e3bd09739a.png">
4. Now build just by using the `webpack` command.

### Watch mode and webpack dev server

It becomes a little bit tedious to re-run the build manually everytime a file changes. For this we run the webpack in a Watch mode so that it can watch for changes and rebuild everytime a file changes.

- Ways of running in Watch Mode :
    1. Command line : `webpack --watch`
    2. Add a `watch: true` key in the webpack.config.js file as below 
        ```javascript
        module.exports = {
            entry: "./app.js",
            output: {
                filename: "bundle.js"
            },
            watch: true
        }
        ```
- Dev Server

    In order to use the HTTP protocol instead of the file protocol ie accessing the index file as `http://domain/index.html` instead of `file:///filepath` we need to setup a webpack dev server which can serve the index file over http. This will help us with the below task :
    1. Serve file over HTTP
    2. Reload the browser on rebuild => Hot reload

    For this we install the webpack dev server globally by running `npm i webpack-dev-server -g` and `npm i webpack-cli -g`. Now we run `webpack-dev-server`.
    Sometimes the global instalations might not work as expected so for that intall the dev server locally. The dev server uses the configuration file to build the project and serve it over http. If I make any change to my app.js file the webpack-dev-server will rebuild the project and reload the browser to serve the project.
    **Note :** Here although we are not providing any index.html file in the url but it still request for index.html file. This is a browser feature.

### Building Multiple Files

1. Add multiple files using the module system : Follow the below steps
    1. Create a login.js
    2. require the login.js file in app.js file by doing `require(./login)`. This will tell webpack to load login.js while it parses the app.js. We could also use the ES6 module system and write `import login from "./login"`.

2. To load a file which is accessible globaly : Follow the below steps
    1. Create a file utils.js
    2. Add that file in the webpack.config.js as below
        ```javascript
        module.exports = {
            entry: ["./utils.js", "./app.js"],
            output: {
                filename: "bundle.js"
            },
            watch: true
        }
        ```
    3. Now since you have changed the webpack.config.js you would need to restart the webpack-dev-server.

### Using Loaders

Loaders is a mechanish to teach webpack new tricks. By default webpack can combine and minify your javascript files, but it doesn't know much things appart from this. By providing loaders in webpack 1 OR rules in webpack 2 you tell the webpack how to process different types of files or even transpile them. 

We are going to add 2 loaders right now
1. __babel__ : This will help us to transpile the javascript versions.
2. __jshint__ : This will help us in linting the js files.

For adding babel to the project we follow the below steps :

1. We intall the packages by adding them to devDependencies in our package.json file and running `npm i`
    ```javascript
      "devDependencies": {
        "babel-core": "^6.26.3",
        "babel-loader": "^7.1.5",
        "babel-preset-env": "^1.7.0",
        "babel-preset-es2015": "^6.24.1",
        "eslint": "^5.5.0",
        "eslint-loader": "^2.1.0",
        "node-libs-browser": "^0.5.3",
        "webpack": "^4.5.0",
        "webpack-cli": "^3.1.0",
        "webpack-dev-server": "^3.1.7"
    }
    ```
2. Now we create a .babelrc file and add the presets as below 
    ```javascript
    {
        "presets": ["es2015"]
    }
    ```
3. Now we configure the webpack using the webpack.config.js to load the babel. For that we add a __module__ section which accepts an array of __rules__ or __loaders__ if you are using webpack 1.X.
    The rules accept an array of object which have 3 basic properties :
    1. test : This accepts a rejex and specifies the type of file or file extension it is going to handle to transpile the file. Mind you this is only to tell the loader about the type of files and not the webpack.
    2. exclude : This also accepts a rejex and specifies the files or folder to be excluded from transpilation.
    3. loader : This is the loader library which needs to be loaded.
    ```javascript
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: "babel-loader"
                }
            ]
        },
    ```
4. We could also use a .es6 extension instead of a js extension to write our es6 file. To tell webpack about this we would need to override the default list of extensions handled by webpack by providing the below configuration in the webpack.
    ```javascript
        resolve: {
            extensions: ['.js','.es6']
        }
    ```
5. We are ready to go now. Just run ```webpack-dev-server``` and it should run now.

To introduce linting to our project we are going to add jshint :

1. For this we will first install the eshint packages. 
    ```javascript
    {
        "eslint": "^5.5.0",
        "eslint-loader": "^2.1.0",
    }
    ```
2. Then we will add a eslint config file ie .eslintrc or .eslintrc.js.
3. Then we will configure our webpack to load these packages.Since we need the first lint the files before doing any other build process like compining and transpiling so we need to configure this as a preloader. Now here we add another property `enforce: 'pre'` which tell webpack that this is a pre loader and needs to be loaded before all other loaders. Also note that the `babel-loader` OR `eslint-loader` are just loaders that load babel and eslint respectively.
    Webpack 2
    ```javascript
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
                loader: "eslint-loader",
                enforce: 'pre'
            }
        ]
    },
    ```
    
    Webpack 1
    ```javascript
    module: {
        preLoaders: [
            {
                test: /\.js$/, 
                exclude: /node_modules/, 
                loader: "eslint-loader"
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
    ```
### Creating a start script

Going forward we may come accross situation where we might need to pass some command line paramaters OR run multiple commands in the command line.
This can easily get a little tedious and confusing. To resolve this issue we use the npm script where we can provide our command line commands.
So we can add `"start": "webpack-dev-server"` into the script property of our package.json file.

### Production vs Development Builds

There are 2 modes to configure in webpack ie `production` and `development`. If you don't provide a mode the webpack will compile with a warning and will default to production mode. There are a few things which webpack does differently for production and development environment. 
1. It minifies the files automaticaly in the production mode but not in the development mode.

There are some things which we might want to remove or add from the production build. We need to do the below steps to do so.
1. We need a separate webpack configuration file for our prod env. So we create a  `webpack-production.config.js`. 
2. Now we can import our webpack.config.js in this file and manupulate it according to our production needs and then export the updated config. For instance if we want to remove the console.log from our prod env we do the following steps :
    1. First we install a `strip-loader` using `npm i strip-loader --save-dev`.
    2. Then we add the below lines of code into our webpack-production.config.js to inject this loader into the config file.
    ```javascript
    let StripLoader = require("strip-loader"),
        devConfig = require("./webpack.config.js"),
        stripLoader = {
            test: [/\.js$/,/\.es6/],
            exclude: /node_modules/,
            loader: StripLoader.loader('console.log')
        };
    devConfig.module.rules.push(stripLoader);
    module.exports = devConfig;
    ```
    Note that we are using this loader to strip any console.log statement from our code. You could also provide more strings using a comma like `StripLoader.loader('console.log','alert')`.You can clearly see that in the above code we have injected the stripLoader in the rules of the webpack.config.js file.
    Also please note that since webpack uses the Commaon js module system internaly so we can use require to import the modules.
3. Now we need to invoke our server using this configuration file. For that we do the following
    1. `webpack-dev-sever --config webpack-production.config.js`
    2. If we want to compile first and then serve the compiled bundle using a seperate server.
        1. Install a separate server using `npm i http-server -g`
        2. Run `webpack --config webpack-production.config.js`
        3. Run `http-server`

## Module 3 : Advanced Build With Webpack

### Organizing files and folders

Generaly we build our files into a folder named build or dist. Webpack builds the js files into a dist folder by default and server it from that folder when it gets a request for a resource. Issues :

1. What if we want to build our files into a custom folder say `build`.
2. What if our javascript source files are inside a folder other that the one which has webpack.config.js like `js` or `src`.
3. What if we want to keep our index.html file inside a custom folder like `public` instead of the root directory or the directory in which we have webpack.config.js.
4. What if we want to setup a different path for our resources in our index.html file that the default or root path. Like instead of `bundle.js` we want it to be  `public/assets/js/bundle.js`.

All these issues can be resolved by configuring our webpack.config.js efficiently. Resolution :


1. To resolve the first issue we make and `path: path.resolve('build/js/')` in the `output` property. This tell webpack that we want our output bundle.js file to reside in build/js folder.
2. To resolve the second issue we setup a context property as `context: path.resolve('js')` which tells webpack that the source files reside in js folder. So the webpack will look for the utils and app file inside the js folder.
3. To resolve the third issue we add 
    ```javascript    
    devServer: {
        contentBase: 'public'
    },
    ```
    This tells the webpack dev server that the resources need to be served from the public folder. So if it gets a request for `index.html` it looks for this file inside the public directory.
4. In the fourth issue we need to create a mapper for our output files served by the devserver. We create an entry `publicPath: 'public/assets/js/'` in the output property which tells the dev server that if it gets a request for `public/assets/js/*.*` then it needs to look for it in the directory `build/js`

### Working with ES6 modules

For this we would need our babel loader to convert the es6 module system to common js module system so that the webpack can then understand it.
Instead of using `require("./login.js")` we use `import {login} from "./login"`. Also we export an object from login.js file by `export {login}`.

### Add Source Map

Source Map is the mechanism to replicate file structure in the browser as in the source code for development purpose. So all the modules in js folder will be replicated in the browser as is event though the files have been combined and compiled.

We can achieve this by :
1. Adding `-d` in front of `webpack` for build. Like `webpack -d`
2. Adding `-d` in front of `webpack-dev-server` for serving the files to the browser. Like `webpack-dev-server -d`

## Module 4 : Creating Multiple Bundles

Sometime we need to build multiple js files instead of one. This can be the case of `lazy loading` or some othe case. For now we will create 3 separate bundles `about.js`,`contact.js`,`home.js` and serve them in 3 different request for `about.html`, `contact.html`, `home.html`. We would also like to keep the common code from the webpack in a `shared.js` file which can be used by all the 3 html files. 

To do this we follow the below steps :
1. Create `about_page.js`,`contact_page.js`,`home_page.js` in the js folder.
2. Create 3 html files namely `about.html`,`contact.html`,`home.html` in the public folder. We also add the respective script files needed in each file.
3. Update the webpack.config.js file to create 3 seperate js build files. For that we do the below steps :
    1. We add different entry point for each file.
        ```javascript 
            entry: {
                about: "./about_page.js",
                contact: "./contact_page.js",
                home: "./home_page.js"
            }
        ```
    2. Then we tell the webpack to use the key of each entry point as the name of the output file.
        ```javascript 
            output: {
                path: path.resolve('build/js/'),
                publicPath: 'public/assets/js/',
                filename: "[name].js"
            },
        ```
4. Also to split each output file into chunks we add the below property to the config file.
    ```javasctpt
        optimization: {
        splitChunks: {
            chunks: "all",
            name: "shared"
        }
    }
    ```
    In this we tell the webpack to split our code into chunks for `all` the entry points and name the chunk as `shared.js`.

## Module 5 : Adding CSS to your build

### Css and Style Loaders

Generaly when we build our project using webpack, we load the Css as a webpack module just like a js file. This have some advantages over adding the css to the index.html file.
1. We don't need to update the index.html file everytime we create a new css file.
2. The browser hot reloades every time we do some change in the Css.

To achieve this we follow the below steps :
1. We install the `css-loader` and `style-loader` using the command `npm i css-loader style-loader --save-dev`.
2. Now we create 2 css file `app.css` and `common.css` inside the css folder.
3. Now we enable webpack to handle and load the css file extension by adding the loader in the rules of webpack.config.js. Please note how we have given the 2 loader together as `style-loader!css-loader`. Here we have provided 2 loader sperated by a !. This tell the webpack to first process the file with css-loader and then with style-loader. We can provide as many loaders separated by ! as we want.
    ```javascript
        {
            test: /\.css$/,
            exclude: /node_modules/,
            loader: "style-loader!css-loader"
        },
    ```
4. Finally we load the app.css and common.css in app.js using the common js module system. Note the files are loader in the order they are specified in the js file. So in this case first common.css is loader followed by app.css.
    ```javascript
        require("../css/app.css");
        require("../css/common.css");
    ```

### Internal implementation of CSS and Style loaders

 If we inspect the network call of the page we will see that there is no css file which loades in the browser. Then how does the CSS reach the browser?
 The webpack injects the css files as seperate style tags in the head section of our index.html file. Apparently this is done by the `style-loader` we specified in the webpack.config.js file. So it makes it the internal css instead of the external css. Also note that the webpack will minify this css if you run it in production mode.
 <img width="354" alt="screen shot 2018-09-03 at 1 17 40 am" src="https://user-images.githubusercontent.com/12914629/44960126-39956200-af17-11e8-84ed-4b67d37d9997.png">

 ### Using SCSS and SASS

To achieve this we follow the below steps :
1. We install the `sass-loader` and `node-sass` using the command `npm i sass-loader node-sass --save-dev`.
2. Now we create 2 css file `index.scss` inside the css folder.
3. Now we enable webpack to handle and load the css file extension by adding the loader in the rules of webpack.config.js. Please note how we have given the 2 loader together as `style-loader!css-loader!sass-loader`. Here we have provided 2 loader sperated by a !. This tell the webpack to first process the file with sass-loader then with css-loader and then with style-loader. We can provide as many loaders separated by ! as we want.
    ```javascript
        {
            test: /\.scss$/,
            exclude: /node_modules/,
            loader: "style-loader!css-loader!sass-loader"
        },
    ```
4. Finally we load the index.scss in app.js using the common js module system. Note the files are loader in the order they are specified in the js file.
    ```javascript
        require("../css/index.scss");
    ```

 ### Using LESS

To achieve this we follow the below steps :
1. We install the `less-loader` and `less` using the command `npm i less-loader less --save-dev`.
2. Now we create 2 css file `index.less` inside the css folder.
3. Now we enable webpack to handle and load the css file extension by adding the loader in the rules of webpack.config.js. Please note how we have given the 2 loader together as `style-loader!css-loader!less-loader`. Here we have provided 2 loader sperated by a !. This tell the webpack to first process the file with sass-loader then with css-loader and then with style-loader. We can provide as many loaders separated by ! as we want.
    ```javascript
        {
            test: /\.less$/,
            exclude: /node_modules/,
            loader: "style-loader!css-loader!less-loader"
        },
    ```
4. Finally we load the index.less in app.js using the common js module system. Note the files are loader in the order they are specified in the js file.
    ```javascript
        require("../css/index.less");
    ```

## Module 6 : Creating a separate Css bundle

Generaly we would prefer to create a separate bundle for our css file than injecting it inline in the head of our html. For that we follow the below steps

1. We first install new package `mini-css-extract-plugin` using `npm i mini-css-extract-plugin --save-dev`.
2. Then we configure our webpack.config.js as below :
    1. We import this plugin using `MiniCssExtractPlugin = require("mini-css-extract-plugin"),` statement.
    2. We add the loaders for sass,scss,css,less extension in the rules section as below 
        ```javascript
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader'
                ]
            }
            // {
            //     test: /\.(sa|sc|c)ss$/,
            //     use: [
            //         devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
            //         'css-loader',
            //         'sass-loader'
            //     ]
            // },
        ```
        Please note that in the above case we define sass,scss and css extensions together and less separately. In the commented section please note that we have used the style-loader instead of the MiniCssExtractPlugin.loader to append the css in the html itself.
    3. Now we add this plugin in the plugins section which tells the webpack that it needs to use this plugin.Also we tell this loader plugin that what would be the name of the output file by the below entry. The location of the output file is provided to this loader by the webpack using the output.path property.
        ```javascript
            plugins: [
                new MiniCssExtractPlugin({
                    filename: devMode ? '[name].css' : '[name].[hash].css'
                })
            ]
        ```
3. We add the below scripts to the package.json file
    ```javascript
        "scripts": {
            "start": "webpack-dev-server -d",
            "startProd": "webpack-dev-server --config=webpack-production.config.js -d",
            "build": "webpack -d",
            "buildProd": "webpack --config=webpack-production.config.js"
        },    
    ```
4. Also note that we have done a new entry in the webpack-production.config.js file `process.env.NODE_ENV = "production";`. This is to set the environment to production so that this value when accessed inside webpack.config.js is set to "production". It is also very important that we write this before we `require("webpack.config.js")` in our webpack-production.config.js file.

    