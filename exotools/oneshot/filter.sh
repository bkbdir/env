camlp5 pa_o.cmo pr_scheme.cmo t.ml | perl -pe 's/\(\`\s(\w+)/\'$1/g;s/\[/(list /g; s/\]/\)/g'
