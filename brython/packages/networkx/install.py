import sys
import re
from os.path import join as pjoin

sys.path.append('..')
from utils import *

path = sys.argv[1]
all_py = all_files(path)

# change collections to collections.abc
replace_files(all_py, lambda f: re.sub(
    'from collections import Mapping',
    'from collections.abc import Mapping', f))

# remove invalid import (utils/decorators.py)
replace_file(pjoin(path, 'utils', 'decorators.py'),
    lambda f: re.sub('from pathlib import Path', 'Path = None', f))

# fix relative import (utils/rcm.py)
replace_file(pjoin(path, 'utils', 'rcm.py'),
    lambda f: re.sub('from ..utils import arbitrary_element',
                     'from networkx.utils import arbitrary_element', f))

# remove yield (classes/function.py/non_edges)
replace_file(pjoin(path, 'classes', 'function.py'),
    lambda f: replace_inner_fn(f, 'non_edges', remove_yield))

# remove 0 < a < b syntax (generators/random_graphs.py/extended_barabasi_albert_graph)
replace_file(pjoin(path, 'generators', 'random_graphs.py'),
    lambda f: replace_inner_fn(f, 'extended_barabasi_albert_graph',
        lambda inner: re.sub('if 0 < deg < clique_degree',
                             'if 0 < deg and deg < clique_degree', inner)))

# remove additional argument to next() (utils/misc.py/pairwise)
replace_file(pjoin(path, 'utils', 'misc.py'),
    lambda f: replace_inner_fn(f, 'pairwise',
        lambda inner: re.sub('next\(b, None\)',
                             'next(b)', inner)))

# fix random state arguments (utils/decorators.py/(py_)random_state)
random_state_fix = r"""if len(args) <= random_state_index:
\1    if 'seed' in kwargs:
\1        args = args + (kwargs['seed'],)
\1        del kwargs['seed']
\1    else: args = args + (None,)"""
def fix_random_state(fn_name):
    replace_file(pjoin(path, 'utils', 'decorators.py'),
        lambda f: replace_inner_fn(f, fn_name,
            lambda inner: re.sub(r'( *)(random_state_arg =.*)',
                                 r'\1' + random_state_fix + r'\n\1\2', inner)))
fix_random_state('random_state')
fix_random_state('py_random_state')

# fix create random state (utils/misc.py/create_py_random_state)
def fix_create_random_state(inner):
    inner2 = re.sub(r'( *)(return random.Random\(.*)',
                    r'\1rand = random.Random()\n'
                  + r'\1rand.seed(random_state)\n'
                  + r'\1return rand', inner)

    inner3 = re.sub(r'( *)(return random._inst)',
                    r'\1return random.Random()', inner2)
    return inner3

replace_file(pjoin(path, 'utils', 'misc.py'),
    lambda f: replace_inner_fn(f, 'create_py_random_state',
        lambda inner: fix_create_random_state(inner)))
