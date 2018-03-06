
# do I have to run ???
# exec ssh-agent fish 

#  keychain --eval --quiet -Q id_rsa _rsa
if status --is-interactive
   set keyfiles
   for file in $HOME/.ssh/*.pub
      set bfile (basename $file) 
      # remove .pub ext anc append to keyfiles
      set keyfiles $keyfiles (echo $bfile | sed 's/\.[^.]*$//')
   end
   echo 'eval keyfiles ' $keyfiles
   keychain --eval --quiet -Q $keyfiles
end
