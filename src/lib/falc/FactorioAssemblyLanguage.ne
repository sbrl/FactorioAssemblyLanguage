@{%
	// import moo from 'moo';
	const moo = require("moo");
	
	const lexer = moo.compile({ // in priority order; first matching rule gets priority
		COMMENT: { match:/\/\/.*?\n/, lineBreaks: true },
		WS: { match: /\s+/, lineBreaks: true },
		REG_GENERAL: /R[1-4]/,
		REG_EXTDEV: /E[A-H]/,
		NAME: /[a-zA-Z][a-zA-Z0-9]*/,
		NUMBER: /[0-9]+/,
		DASH: /-/,
		HASH: /#/,
	});
	
	const symbol_table = new Map();
	
	function symbol_table_add(tok_name, throw_if_already_defined=true) {
		if(symbol_table.has(tok_name.value)) {
			const existing = symbol_table.get(tok_name.value);
			throw new Error(`Error: Symbol ${tok_name.value} is already defined on line ${existing.line} col ${existing.col}, attempted to redefine on line ${tok_name.line} col ${tok_name.col}`);
		}
		symbol_table.set(tok_name.value, tok_name);
	}
	
	function symbol_table_check(tok_name) {
		if(!symbol_table.has(tok_name.value)) {
			throw new Error(`Error: Undefined symbol ${tok_name.value} on line ${tok_name.line} col ${tok_name.col}`);
		}
		tok_name.sym = symbol_table.get(tok_name.value);
	}
	
	function process_args(data) {
		const instruction = data[0];
		instruction.args = data.filter(arg => arg !== null)
			.slice(1);
		return instruction;
	}
%}

@lexer lexer

program -> statement_list {% ([list]) => list %}

statement_list -> instruction _:?
		{% ([instruction]) => [instruction] %}
	| %COMMENT {% () => [] %}
	| _ statement_list
		{% ([_, list]) => list %}
	| instruction _ statement_list
		{% ([instruction, _, list]) => {
			if(!(instruction instanceof Array))
				instruction = [instruction];
			list.unshift(...instruction);
			return list;
		} %}
	| %COMMENT statement_list
		{% ([_, list]) => list %}
	| _ {% () => [] %}

instruction -> i_hwconst {% id %}
	| i_const {% id %}
	| i_store {% id %}
	| i_add {% id %}
	| i_sub {% id %}
	| i_mul {% id %}
	| i_div {% id %}
	| i_wait {% id %}
	| i_memget {% id %}
	| i_memset {% id %}


i_hwconst	-> "HWCONST"	_ name	_ integer
	{% (data) => {
		data[2].type = `SYMBOL_HWCONST`; // was NAME, ref the lexer
		symbol_table_add(data[2]);
		return process_args(data);
	} %}
i_const		-> "CONST"		_ name	_ integer
	{% (data) => {
		data[2].type = `SYMBOL_HWCONST`; // was NAME, ref the lexer
		symbol_table_add(data[2]);
		console.log(`DEBUG:CONST data AFTER`, data);
		return process_args(data);
	} %}
i_store		-> "STORE"	_ val_int	_ register
	{% process_args %}
i_add		-> "ADD"	_ val_int	_ val_int	_ register
	{% process_args %}
i_sub		-> "SUB"	_ val_int	_ val_int	_ register
	{% process_args %}
i_mul		-> "MUL"	_ val_int	_ val_int	_ register
	{% process_args %}
i_div		-> "DIV"	_ val_int	_ val_int	_ register
	{% process_args %}
i_wait		-> "WAIT"	_ val_int	_ %REG_EXTDEV
	{% process_args %}
i_memget	-> "MEMGET"	_ mem_addr	_ register
	{% process_args %}
i_memset	-> "MEMSET"	_ val_int	_ mem_addr
	{% process_args %}


mem_addr -> %HASH number {% ([hash,number]) => {
		return {
			type: "MEM_ADDR",
			value: number.value,
			text: `${hash.value}${number.value}`,
			offset: hash.offset,
			lineBreaks: hash.lineBreaks+number.lineBreaks,
			line: hash.line,
			col: hash.col,
		}
	} %}

val_int -> register {% id %}
	| integer {% id %}
	| name_ref {% id %}



name_ref -> name {% ([name]) => {
	symbol_table_check(name);
	return name;
} %}
name -> %NAME {% id %}

register -> %REG_GENERAL {% id %}
	| %REG_EXTDEV {% id %}

integer -> number {% id %}
	| %DASH number {% ([_,second]) => {
		second.value = -second.value;
		second.text = "-"+second.text;
		second.offset -= 1;
		second.col -= 1;
		return second;
	} %}


number -> %NUMBER {% ([first]) => {
		first.value = parseInt(first.value);
		return first;
	} %}

_ -> %WS {% (data) => null %}