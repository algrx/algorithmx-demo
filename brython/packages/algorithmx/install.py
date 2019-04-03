import sys
import re
from os.path import join as pjoin

sys.path.append('..')
from utils import *

path = sys.argv[1]

def add_closure(text, indent, args_text):
    inner_closure = INDENT + text.replace('\n', '\n' + INDENT).rstrip()
    return indent + 'def _closure({}):\n'.format(args_text) \
        + inner_closure + '\n' \
        + indent + '_closure({})\n'.format(args_text)

# add closures to loops (graphics/NodeSection.py/click,hoverin,hoverout)
replace_file(pjoin(path, 'graphics', 'NodeSelection.py'),
    lambda f: replace_inner_indent(f,
        r'for i, k in enumerate\(self._context.ids\):',
        lambda text, indent: add_closure(text, indent, 'i, k')))
