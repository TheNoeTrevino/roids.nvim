; extends 


; // language: sql
; const testtet: string = `
; select * 
; from user
; `
(
  (comment) @injection.language
  .
  (lexical_declaration 
    (variable_declarator 
      name: (identifier) 
      type: (type_annotation 
        (predefined_type)) 
      value: (template_string 
        (string_fragment) @injection.content )))?
  (#set! injection.include-children)
  (#set! injection.combined)
  (#gsub! @injection.language "^//%s*language:%s*(%w+).*$" "%1")
  (#set! priority 201)
)

; // language: sql
; var testtest: string = `
; select * 
; from user
; `
; TODO: is there a way to make a node optional? 
(
  (comment) @injection.language
  .
  (variable_declaration ; [16, 0] - [19, 1]
    (variable_declarator ; [16, 4] - [19, 1]
      name: (identifier) ; [16, 4] - [16, 12]
      type: (type_annotation ; [16, 12] - [16, 20]
        (predefined_type)) ; [16, 14] - [16, 20]
      value: (template_string ; [16, 23] - [19, 1]
        (string_fragment) @injection.content ))) ; [16, 24] - [19, 0]
  (#set! injection.include-children)
  (#set! injection.combined)
  (#gsub! @injection.language "^//%s*language:%s*(%w+).*$" "%1")
  (#set! priority 201)
)
