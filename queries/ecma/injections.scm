; extends

; variable (with angled quotes)
; /* html */ `<html>`
; /* sql */ `SELECT * FROM foo`
(variable_declarator
	(comment) @injection.language (#offset! @injection.language 0 3 0 -3)
	(template_string) @injection.content (#offset! @injection.content 0 1 0 -1)
	)

; variable (with single/double quotes)
(variable_declarator
	(comment) @injection.language (#offset! @injection.language 0 3 0 -3)
	(string (string_fragment) @injection.content)
	)

; argument (with angled quotes)
; foo(/* html */ `<span>`)
; foo(/* sql */ `SELECT * FROM foo`)
(call_expression
	arguments:
	[
	 (arguments
		 (comment) @injection.language (#offset! @injection.language 0 3 0 -3)
		 (template_string) @injection.content (#offset! @injection.content 0 1 0 -1)
		 )
	 ]
	)

; argument (with single/double quotes)
(call_expression
	arguments:
	[
	 (arguments
		 (comment) @injection.language (#offset! @injection.language 0 3 0 -3)
		 (string (string_fragment) @injection.content)
		 )
	 ]
	)
