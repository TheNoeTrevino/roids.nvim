-- • The following top level Treesitter functions have been moved:
--   • *vim.treesitter.inspect_language()*    -> |vim.treesitter.language.inspect()|
--   • *vim.treesitter.get_query_files()*     -> |vim.treesitter.query.get_files()|
--   • *vim.treesitter.set_query()*           -> |vim.treesitter.query.set()|
--   • *vim.treesitter.query.set_query()*     -> |vim.treesitter.query.set()|
--   • *vim.treesitter.get_query()*           -> |vim.treesitter.query.get()|
--   • *vim.treesitter.query.get_query()*     -> |vim.treesitter.query.get()|
--   • *vim.treesitter.parse_query()*         -> |vim.treesitter.query.parse()|
--   • *vim.treesitter.query.parse_query()*   -> |vim.treesitter.query.parse()|
--   • *vim.treesitter.add_predicate()*       -> |vim.treesitter.query.add_predicate()|
--   • *vim.treesitter.add_directive()*       -> |vim.treesitter.query.add_directive()|
--   • *vim.treesitter.list_predicates()*     -> |vim.treesitter.query.list_predicates()|
--   • *vim.treesitter.list_directives()*     -> |vim.treesitter.query.list_directives()|
--   • *vim.treesitter.query.get_range()*     -> |vim.treesitter.get_range()|
--   • *vim.treesitter.query.get_node_text()* -> |vim.treesitter.get_node_text()|
---@type boolean
local debugging = false

local ts = vim.treesitter
local log = debugging or vim.notify

local comment_query = ts.query.parse(
	"java",
	[[
  (line_comment) @capturegroup
  ]]
)

local string_query = ts.query.parse(
	"java",
	[[
  (string_fragment) @capturegroup
  (multiline_string_fragment) @capturegroup
  ]]
)

-- get all the finals after a comment
local constant_query = ts.query.parse(
	"java",
	[[
    ((line_comment) 
    .
    (constant_declaration 
      (modifiers) 
      type: (type_identifier) 
      declarator: (variable_declarator 
        name: (identifier) 
        value: (string_literal 
          (multiline_string_fragment)))) @capture)
  ]]
)

-- local tree = ts.get_parser():parse()[1]

---@param node TSNode?
---@param type string
---@return string?
-- Recursive function that finds the first child that matches this type
-- via depth first search.
-- For example:
--
--```scheme
-- ((line_comment)
-- .
-- (constant_declaration
--   (modifiers)
--   type: (type_identifier)
--   declarator: (variable_declarator
--     name: (identifier)
--     value: (string_literal
--       (multiline_string_fragment)))) @capture)
--```
--
-- If you pass in the `constant_delaration` node and `multiline_string_fragment`,
-- you will get @capture node
local function find_type_in_tree(node, type)
	if not node then
		return
	end

	if node and node:type() == type then
		return ts.get_node_text(node, vim.api.nvim_get_current_buf())
	end

	if node then
		for i = 0, node:child_count() - 1 do
			local found = find_type_in_tree(node:child(i), type)
			if found then
				return found
			end
		end
	end
end

---@param node_type string
---@param child_node_type string
---@param langs[string]
local function possible_injections(node_type, child_node_type, langs)
	for _, node, _ in constant_query:iter_captures(tree:root(), 0) do
		local prev_node = node:prev_sibling()

		if prev_node and prev_node:type() == node_type then
			local prev_text = ts.get_node_text(prev_node, vim.api.nvim_get_current_buf())
			for _, lang in ipairs(langs) do
				if prev_text and string.find(prev_text, "language: " .. lang) then
					local result_text = find_type_in_tree(node, child_node_type)
					if result_text then
						log("found " .. lang .. " text : " .. result_text)
					-- make a function that takes in a node and the text, then replaces
					-- the node text with the new text from our formatters
					else
						log("none found")
					end
				end
			end
		end
	end
end

-- if debugging == true then
-- 	log("Debugging is on for roids.nvim")
-- 	possible_injections("line_comment", "multiline_string_fragment", { "sql", "python" })
-- end
