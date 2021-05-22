# RSS3 SDK JavaScript

JavaScript SDK for [RSS3-Hub](https://github.com/NaturalSelectionLabs/RSS3-Hub)

## Quick Start

### Install

```bash
npm install rss3 --save
```

or

```bash
yarn add rss3
```

### Demo

```ts
import RSS3 from 'rss3';

const persona = new RSS3({
    endpoint: 'https://rss3-hub-playground-6raed.ondigitalocean.app',
    privateKey:
        '0x47e18d6c386898b424025cd9db446f779ef24ad33a26c499c87bb3d9372540ba',
    callback: function (data) {
        console.log(data);

        persona.profilePatch({
            name: 'RSS3',
        });
        persona.itemPost({
            title: 'Hello',
        });
        persona.syncFile();
    },
});
```

## API

### Initialization

```ts
const persona = new RSS3({
    endpoint: 'https://rss3-hub.example',
    privateKey: '0x.....',
    callback: (persona) => {
        console.log(persona);
    },
});
```

| Name       | Optional | Description                                                         |
| ---------- | -------- | ------------------------------------------------------------------- |
| endpoint   | false    | RSS3 Hub Address                                                    |
| privateKey | true     | Persona's private key, a new persona will be created if it is empty |
| callback   | false    | Initialization callback                                             |

### ProfilePatch

### ItemPost

### ItemsPatch

### SyncFile

### GetFile

### DeleteFile
