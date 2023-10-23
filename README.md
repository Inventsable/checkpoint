# CRITICAL

- Something's going wrong with Groups, their contents aren't being processed
  ^ Due to `filteredList` mistakenly failing their locked/visible state

# TODO

- Write scripting in such a way that panel can process chunks rather than entire artwork file, would be needed on largest of files
- Create basic demo site with Lottie outlines of Pear and Mango, credit original artist
- Needs input-scroll autoselect
- Noticing that the CSS transitions fire on panel mount for color-picker and checkbox... It'd be better if the transitions were disabled until a second or two after mount so they appear in their intended state rather than having default transitioning to intended the first 200ms or so of the panel mount.

- Should disable color pickers for anchor / handle when Use Layer Label Color is active?
- `Group Related` is causing scripting issues along with documents which have groups themselves
- Lottie should load _as correct colors_ first if possible. It might need to be parsed pre-load and have their values written in if it's not possible via CSS?
