;  extends

; @Modifying
; @Query(
;   value = """
;       DELETE Users u
;       where u.id = :id
;     """,
;   nativeQuery = true
;   )
; int deletePieceById(@Param(value = "id") Long id);
(annotation 
  name: (identifier) @annotation 
  arguments: (annotation_argument_list 
    (element_value_pair 
      key: (identifier) @value
      value: (string_literal 
        (multiline_string_fragment) @injection.content 
      )))

  (#eq? @annotation "Query")
  (#eq? @value "value")
  (#set! injection.language "sql")
)

(
  (line_comment) @injection.language
  .
  (constant_declaration
    (modifiers)
    type: (type_identifier)
    declarator: (variable_declarator
      name: (identifier)
      value: (string_literal
        (multiline_string_fragment) @injection.content)))
  (#gsub! @injection.language "^//%s*language:%s*(%w+).*$" "%1")
  (#set! priority 201)
)

(local_variable_declaration
  declarator: (variable_declarator
    value: (string_literal
      (multiline_string_fragment) @injection.content
    )
  )
) @declaration

