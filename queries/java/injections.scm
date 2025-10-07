;  extends

; `value' param in the `@Query` annotation
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


; Annotation of static strings
; // language: sql
; public static final String userQuery = """
;   SELECT u.id, u.name, u.email
;   FROM users u
; """;
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


; // language: sql
; private static final String test = """
;   select * 
;   from table
; """;
(
  (line_comment) @injection.language
  .
  (field_declaration 
    (modifiers) 
    type: (type_identifier) 
    declarator: (variable_declarator 
      name: (identifier) 
      value: (string_literal 
        (multiline_string_fragment) @injection.content)))
  (#gsub! @injection.language "^//%s*language:%s*(%w+).*$" "%1")
  (#set! priority 201)
)


(
  (line_comment) @injection.language
  .
  (local_variable_declaration 
    type: (type_identifier) 
    declarator: (variable_declarator 
      name: (identifier) 
      value: (string_literal 
        (multiline_string_fragment) @injection.content))) 
  (#gsub! @injection.language "^//%s*language:%s*(%w+).*$" "%1")
  (#set! priority 201)
)
