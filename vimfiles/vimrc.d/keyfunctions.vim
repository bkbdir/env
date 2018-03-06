
function! Vif()
    silent !clear
    silent execute  "make -f vi.mk vif  > /dev/null &" | redraw!
endfunction

function! Vit()
    silent !clear
    silent execute  "make -f vi.mk vit  > /dev/null &" | redraw!
endfunction

nnoremap f :w<cr>:call Vif()<cr>
nnoremap t :w<cr>:call Vit()<cr>
nnoremap s :w<cr>
