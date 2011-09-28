
# Continuous Bench

  A small Node.js application for benchmarking projects in a continuous manner.

  ![screenshot](http://f.cl.ly/items/1R2S0r1S0i052T1B1v2k/Screenshot.png)

## Project setup

  Setting up a project to use CB is simple, all you need is a `make benchmark` target, outputting colon-delimited results. The labels on the left-hand side are used for display in reporting, and the values on the right represent ops/s or whatever you wish.

  Below is an example from [Jade](http://github.com/visionmedia/jade):
  
```
$ make benchmark
tiny: 197874
small: 29173
small locals: 20983
```

  Below is an example from Express:

```
$ make benchmark
Hello World: 6180.57
JSON: 6120.90
Middleware: 6703.47
```