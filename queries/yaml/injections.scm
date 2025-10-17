; extends

; Support Idea-style injection: # language:yaml

; Injaction for block_scalar queries
((comment) @injection.language
  (#gsub! @injection.language "#%s*language:%s*([%w%p]+)%s*" "%1")
  .
  (block_mapping_pair
    value: (block_node
      (block_scalar) @injection.content
      ; Start parse only after block indicator
      (#offset! @injection.content 0 1 0 0))))

((comment) @injection.language
  (#gsub! @injection.language "#%s*language:%s*([%w%p]+)%s*" "%1")
  value: (block_node
    (block_mapping
      .
      (block_mapping_pair
        value: (block_node
          (block_scalar) @injection.content
          (#offset! @injection.content 0 1 0 0))))))

; Injection for unquoted string scalsrs
((comment) @injection.language
  (#gsub! @injection.language "#%s*language:%s*([%w%p]+)%s*" "%1")
  .
  (block_mapping_pair
    value: (flow_node
      (plain_scalar
        (string_scalar) @injection.content))))


((comment) @injection.language
  (#gsub! @injection.language "#%s*language:%s*([%w%p]+)%s*" "%1")
  value: (block_node
    (block_mapping
      .
      (block_mapping_pair
        value: (flow_node
          (plain_scalar
            (string_scalar) @injection.content))))))

; Injection for quoted string scalars
((comment) @injection.language
  (#gsub! @injection.language "#%s*language:%s*([%w%p]+)%s*" "%1")
  .
  (block_mapping_pair
    value: (flow_node
      [
        (double_quote_scalar)
        (single_quote_scalar)
      ] @injection.content))
  ; Don't parse last quote as bash sentence
  (#offset! @injection.content 0 1 0 -1))

((comment) @injection.language
  (#gsub! @injection.language "#%s*language:%s*([%w%p]+)%s*" "%1")
  value: (block_node
    (block_mapping
      .
      (block_mapping_pair
        value: (flow_node
          [
            (double_quote_scalar)
            (single_quote_scalar)
          ] @injection.content
          (#offset! @injection.content 0 1 0 -1))))))


