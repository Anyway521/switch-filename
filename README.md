## Switch - Filename  

In fact, this plugin is dedicated to changing the variables in the file content that contain vocabulary related to the file name when you change the file name.

For example, there is a file named "my_app.vue", the file contains variables that contain the keywords "MyApp", "my-app", "myApp", "my_app", when you rename the file to "my_demo", the keywords of the variables in the file are automatically replaced with "MyDemo", "my-demo", "myDemo", "my_demo".

![feature X](https://raw.githubusercontent.com/Anyway521/switch-filename/main/image/gif1.gif)

> Tip: Based on the image above, you may already be aware of the use case for this plugin, when you need to make small adjustments to the file (no time for refactoring). If your project already has a lot of files to do the above, re-creating a project might be a better option.

## Extension Settings

The file keyword styles currently supported by this plugin include "pascalCase", "camelCase", "kebabCase", and "snakeCase". 

* `switch-filename.variableStyle`: Switch modes for keywords:.

Two switching modes are supported, which can be set by the variable `switch-filename.variableStyle`.

-  `all` (default)  
    When "switch-filename.variableStyle" is set to "all",  the keywords of the above four styles will be replaced.
-  `pascalCase` or `camelCase` or `kebabCase` or `snakeCase`  
   When "switch-filename.variableStyle" is set to "pascalCase", only pascalCase style keywords will be replaced, the same with several others.

## Release Notes

### 1.0.0


## Resources

 - [Github](https://github.com/Anyway521/switch-filename)

## WeChat
z24115