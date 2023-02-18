Q. write express generator command with varying options to generate express app with following features:

  . using ejs as template engine
    ```
    express --ejs app1
    ```
  . no views for express application
    ```
    express --no-view app2
    ```
  . express app with gitignore
  . express app with sass support for styling.
    ```
    express --git --css sass app3
    ```
  . ejs as template engine and sass for styling
    ```
    express --view=ejs --css sass app4
    ``` 
  . pug as template engine and gitignore together
    ```
    express --view=pug --git app4
    ``` 