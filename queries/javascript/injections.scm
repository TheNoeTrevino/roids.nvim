; extends

  ; // language: sql
  ; return `
  ;   select * 
  ;   from table
  ;   `
(
  (comment) @injection.language
  .
  (return_statement 
    (template_string 
      (string_fragment) @injection.content ))
  (#gsub! @injection.language "^//%s*language:%s*(%w+).*$" "%1")
  (#set! injection.combined)
)

; // language: sql
; const no = `
;   select * 
;   from table
; `;
(
  (comment) @injection.language
  .
  (lexical_declaration 
    (variable_declarator 
      name: (identifier) 
      value: (template_string 
        (string_fragment) @injection.content )))
  (#gsub! @injection.language "^//%s*language:%s*(%w+).*$" "%1")
  (#set! injection.combined)
)


; FIXME: is there are three in a row, last does not parse correctly
; // language: sql
; var no = `
;   select * 
;   from table
; `;
(
  (comment) @injection.language
  .
  (variable_declaration 
    (variable_declarator 
      name: (identifier) 
      value: (template_string 
        (string_fragment) @injection.content )))
  (#gsub! @injection.language "^//%s*language:%s*(%w+).*$" "%1")
  (#set! injection.combined)
)



; // language: sql
; const TAGGED_LITERAL = stripIndent`
;     select *
;     from table
; `;
(
  (comment) @injection.language
  .
  (lexical_declaration 
    (variable_declarator 
      name: (identifier) 
      value: (call_expression 
        function: (identifier) 
        arguments: (template_string 
          (string_fragment) @injection.content )))) 
  (#gsub! @injection.language "^//%s*language:%s*(%w+).*$" "%1")
  (#set! injection.combined)
)


; const CONFIG = {
;   // language: sql
;   query: `
;     select *
;     from table
;   `,
(
  (comment) @injection.language
  .
  (pair 
    key: (property_identifier) 
    value: (template_string 
      (string_fragment) @injection.content )) 
  (#gsub! @injection.language "^//%s*language:%s*(%w+).*$" "%1")
  (#set! injection.combined)
)
