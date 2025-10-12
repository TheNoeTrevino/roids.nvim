; extends



; # language: sql
; language: py
; string = """
;   select * from user
; """
(
  (comment) @injection.language
  .
  (expression_statement 
    (assignment 
      left: (identifier) 
      right: (string 
        (string_start) 
        (string_content) @injection.content ))) 
  (#set! priority 201)
  (#gsub! @injection.language "^#%s*language:%s*(%w+).*$" "%1")
  (#set! priority 201)
)


; same as above, but right after a function declaration
(
  (comment) @injection.language
  .
  body: (block 
  (expression_statement 
    (assignment 
      left: (identifier) 
      right: (string 
        (string_start) 
        (string_content) @injection.content )))) 
  (#set! priority 201)
  (#gsub! @injection.language "^#%s*language:%s*(%w+).*$" "%1")
  (#set! priority 201)
)
