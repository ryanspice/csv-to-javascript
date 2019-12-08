# [csv-to-javascript](https://github.com/ryanspice/csv-to-javascript)

*csv-to-javascript* is a JavaScript package library containing various methods for importing *.csv file. 

## Installation

*csv-to-javascript*'s core purpose is to import *.csv files, but I've provided numerous ways to do this, see examples below. 

## Usage

Use *csv-to-javascript* as a standalone command or import it; see examples.

```javascript
import csvToJs from "csv-to-javascript";

csvToJs(await (await fetch('*.csv')).text())
```
or in command line
```javascript
npx csv-to-javascript <path> --json
```

demo

```javascript
yarn start
```
## Examples

#### Vanilla ES6 + Vanilla Parse

ES6 bundle provides an optimized webpack output which will support targeted browsers with features like **classes** and **async/await**.
```javascript
yarn vanilla
```

#### Angular + Webpack "csv-loader"

Built with the latest Angular CLI, this example leverages "csv-loader" and Webpack to load and code split a *.csv file accordingly.

```javascript
yarn angular <command>
```

#### React + PapaParse

"Papa Parse is the fastest in-browser CSV (or delimited text) parser for JavaScript. It is reliable and correct according to RFC 4180..." ~ https://www.papaparse.com/ -
https://github.com/mholt/PapaParse



```javascript
yarn react
```

#### Vue + "csv-to-javascript" module

```javascript
yarn vue
```

## Testing
```javascript
yarn <build> --test 

yarn vanilla --test
yarn angular --test
yarn react --test
yarn vue --test
```

## Documentation

N/A


### License

*csv-to-javascript* is [MIT licensed](./LICENSE).
