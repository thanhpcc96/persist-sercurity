# Intro

Using AES hash you private data before save to LocalStorage or AsyncStorage(react native). Pass gray box test

# install

```
yarn add https://github.com/thanhpcc96/persist-sercurity.git
```

or

```
npm install -save https://github.com/thanhpcc96/persist-sercurity.git
```

# use

```
 import createCompressEncryptor from 'redux-persist-security';
 ...
 ...
 const transformer = createCompressEncryptor({
  secretKey: '!OGnJ^HNi8Hx6WX1uu%YRYrxA7A9%7GIMZ93wI',
  whitelist: ['auth'],
  onError: function(error) {
    console.log(error);
  }
});
...
...
const persistedReducer = persistReducer(
  {
    key: 'xxx',
    storage: AsyncStorage,
    debound: 300,
    whitelist: ['auth', 'cart', 'temp', 'intro', 'locale'],
    transforms: [transformer]
  },
  reducers
);
```

# More

## whitelist

array string: include property you want hash, don't hash all reducer, this cause make app very slow

## blacklist:

array string

## onError

callback, return error

# Test
[[IMG]]
