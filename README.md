# Roids
A neovim plugin for language injection

## Installation

Lazy:
``` lua
return {
  { "TheNoeTrevino/roids.nvim" },
}
```


## Usage

### Annotations:

Annotate your string variable declaration with `language: {myLang}`
``` python
# language: html
htmlContent = """
    <div class="container">
        <h1>Hello World</h1>
        <p>This is an HTML example</p>
    </div>
"""
```

## Current Support
The plugin is in pre-alpha, so support is limited right now.

### Java
Supported Scenarios:
- Multiline string declarations
- `value` param in Spring's `#Query`
<img width="3657" height="1805" alt="Screenshot 2025-10-05 222620" src="https://github.com/user-attachments/assets/ce2c6295-aa6f-4336-a7f9-0808f658f0aa" />


### Python 
Supported Scenarios
- Multiline string declarations
<img width="3543" height="1892" alt="Screenshot 2025-10-05 230553" src="https://github.com/user-attachments/assets/778e1416-7c0e-4323-b2e0-385fe00bc6d3" />

<details>

<summary>Future Plans</summary>

## Future Plans

- Add formatting into the injected language using the formatters mason has installed

- Increase filetype support
- [ ] Java
- [ ] Go
- [ ] CSharp
- [ ] Typescript
- [ ] Javascript
- [ ] Make use of treesitter's `extends` to reuse queries across fts. Like ts and tsx

</details>
  
This plugin is inspired by the [Jetbrains language injection.](https://www.jetbrains.com/help/idea/using-language-injections.html) 
