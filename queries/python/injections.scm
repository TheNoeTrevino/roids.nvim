; extends


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
  (#gsub! @injection.language "^##%s*language:%s*(%w+).*$" "%1")
  (#set! priority 201)
)
