;  extends


; this is directly after the function declaration
; // language: sql
; insertEntryQuery := `
;  INSERT INTO note_game_entries (
;    user_id,
;  )
;  VALUES (
;    :user_id,
;  )
;  RETURNING
;    id
;  `
(
  (comment) @injection.language
  .
  (statement_list 
    (short_var_declaration 
      left: (expression_list 
        (identifier)) 
      right: (expression_list 
        (raw_string_literal 
          (raw_string_literal_content) @injection.content  )))) 
  (#set! injection.include-children)
  (#set! injection.combined)
  (#gsub! @injection.language "^//%s*language:%s*(%w+).*$" "%1")
  (#set! priority 201)
)

; same as above, but can be after the function declaration 
(
  (comment) @injection.language
  .
  (short_var_declaration 
    left: (expression_list 
      (identifier)) 
    right: (expression_list 
      (raw_string_literal 
          (raw_string_literal_content) @injection.content ))) 

  (#set! injection.include-children)
  (#set! injection.combined)
  (#gsub! @injection.language "^//%s*language:%s*(%w+).*$" "%1")
  (#set! priority 201)
)



; // language: sql
; const myStaticString = `
; select * from users
;`
(
  (comment) @injection.language
  .
  (const_declaration 
    (const_spec 
      name: (identifier) 
      value: (expression_list 
        (raw_string_literal 
          (raw_string_literal_content) @injection.content ))))
  (#set! injection.include-children)
  (#set! injection.combined)
  (#gsub! @injection.language "^//%s*language:%s*(%w+).*$" "%1")
  (#set! priority 201)
)
