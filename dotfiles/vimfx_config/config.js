let {commands} = vimfx.modes.normal
vimfx.addCommand({
  name: 'search_bookmarks',
  description: 'Search bookmarks',
  category: 'location',
  order: commands.focus_location_bar.order + 1,
}, (args) => {
  commands.focus_location_bar.run(args)
  args.vim.window.gURLBar.value = '* '
});
vimfx.set('custom.mode.normal.search_bookmarks', 'xx')
