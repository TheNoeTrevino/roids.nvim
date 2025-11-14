;  extends

(
  (comment) @injection.language
  .
  (field_declaration 
    (modifier) 
    (modifier) 
    (modifier) 
    (variable_declaration 
      type: (predefined_type) 
      (variable_declarator 
        name: (identifier) 
        (raw_string_literal 
          (raw_string_start) 
          (raw_string_content) @injection.content
          (raw_string_end))))) 
  (#set! injection.combined)
  (#gsub! @injection.language "^//%s*language:%s*(%w+).*$" "%1")
  (#set! priority 201)
)

(
  (comment) @injection.language
  .
  (field_declaration 
  (modifier) 
  (modifier) 
  (variable_declaration 
    type: (predefined_type) 
    (variable_declarator 
      name: (identifier) 
      (raw_string_literal 
        (raw_string_start) 
        (raw_string_content) @injection.content
        (raw_string_end))))) 
  (#set! injection.combined)
  (#gsub! @injection.language "^//%s*language:%s*(%w+).*$" "%1")
  (#set! priority 201)
)

(
  (comment) @injection.language
  .
  (field_declaration 
    (modifier) 
    (modifier) 
    (modifier) 
    (variable_declaration 
      type: (predefined_type) 
      (variable_declarator 
        name: (identifier) 
        (verbatim_string_literal) ; move this over 2, because of the @, and up one row
          @injection.content(#offset! @injection.content 0 2 0 -1))))
  (#set! injection.combined)
  (#gsub! @injection.language "^//%s*language:%s*(%w+).*$" "%1")
  (#set! priority 201)
)

(
  (comment) @injection.language
  .
  (property_declaration 
    (modifier) 
    type: (predefined_type) 
    name: (identifier) 
    accessors: (accessor_list 
      (accessor_declaration)) 
    value: (raw_string_literal 
      (raw_string_start) 
      (raw_string_content) @injection.content
      (raw_string_end))) 
  (#set! injection.combined)
  (#gsub! @injection.language "^//%s*language:%s*(%w+).*$" "%1")
  (#set! priority 201)
)

(
  (comment) @injection.language
  .
  (local_declaration_statement 
    (variable_declaration 
      type: (predefined_type) 
      (variable_declarator 
        name: (identifier) 
        (raw_string_literal 
          (raw_string_start) 
          (raw_string_content) @injection.content
          (raw_string_end))))) 
  (#set! injection.combined)
  (#gsub! @injection.language "^//%s*language:%s*(%w+).*$" "%1")
  (#set! priority 201)
)

(
  (comment) @injection.language
  .
  (field_declaration 
    (modifier) 
    (modifier) 
    (variable_declaration 
      type: (predefined_type) 
      (variable_declarator 
        name: (identifier) 
        (verbatim_string_literal) @injection.content))) 
  (#set! injection.combined)
  (#gsub! @injection.language "^//%s*language:%s*(%w+).*$" "%1")
  (#set! priority 201)
)
