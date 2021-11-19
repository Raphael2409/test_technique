# spinal-browser-admin

## Dependencies


### Install [pm2](https://github.com/Unitech/pm2) globally
```
$ npm install pm2 -g
```


## Installation

### Initilize a package.json file

```
$ npm init
```

### Install the package locally

This will install the package
  - [spinal-browser-admin](https://github.com/spinalcom/spinal-browser-admin)
    - [spinal-core-hub](https://github.com/spinalcom/spinal-core-hub)
    - [spinal-core-connectorjs](https://github.com/spinalcom/spinal-core-connectorjs)


```
npm install git+https://github.com/spinalcom/spinal-browser-drive.git
```

## Configuration

### Edit the file `.config.json`

 the default config is the folowing:
 ```
{
  "spinal-core-hub": {
    "env": {
      "SPINALHUB_PORT": 7777,
      "SPINALHUB_IP": "127.0.0.1"
    },
    "env_test": {
      "SPINALHUB_PORT": 7777,
      "SPINALHUB_IP": "127.0.0.1"
    },
    "env_production": {
      "SPINALHUB_PORT": 7777,
      "SPINALHUB_IP": "127.0.0.1"
    }
  }
}
```

## Run the `launch.config.js` script with pm2
```
$ pm2 start launch.config.js
```

## Basic usage

The drive is a browser application. To use it you need to access it via a browser (you may change the host/port corresponding to your `.config.json` file):

[`http://127.0.0.1:7777/html/admin/index.html`](http://127.0.0.1:7777/html/admin/index.html)

The 3 basic account are :

Username | Password
-|-
admin | JHGgcz45JKilmzknzelf65ddDadggftIO98P
root | 4YCSeYUzsDG8XSrjqXgkDPrdmJ3fQqHs
user | LQv2nm9G2rqMerk23Tav2ufeuRM2K5RG
