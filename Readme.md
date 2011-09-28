# Continuous Bench

  A small node.js application for benchmarking projects in a continuous manner. Works with any project! all you need is a Makefile :)

  ![screenshot](http://f.cl.ly/items/1R2S0r1S0i052T1B1v2k/Screenshot.png)

## Setup

 Install dependencies:

```
$ npm install -d
```

 Start the app:

```
$ node app
Express server listening on port 3000 in development mode
```

 Start [Kue](http://learnboost.github.com/kue) to process the jobs:

```
$ node jobs
Kue listening on port 8888
```

  Benchmark against a specific commit:

```
$ curl -d 'commit=HEAD' http://local/visionmedia/express/benchmark
Accepted
```

  View the reports by visiting `http://localhost:3000/visionmedia/express`, where you may manually enter commits as well.

## Benchmarking projects

  Setting up a project to use CB is simple, all you need is a `make benchmark` target, outputting colon-delimited results. The labels on the left-hand side are used for display in reporting, and the values on the right represent ops/s or whatever you wish.

  Below is an example from the Jade template engine using this [script](https://github.com/visionmedia/jade/blob/master/support/benchmark.js):
  
```
$ make benchmark
tiny: 197874
small: 29173
small locals: 20983
```

  Below is an example from Express using this HTTP benchmark [script](https://github.com/visionmedia/express/blob/master/support/bench):

```
$ make benchmark
Hello World: 6180.57
JSON: 6120.90
Middleware: 6703.47
```

 Keep in mind that the label/values are completely arbitrary, you may have any number of these.