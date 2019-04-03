import re
import glob
from os.path import join as pjoin

def all_files(dir, pattern='**/*.py'):
    return glob.glob(pjoin(dir, pattern), recursive=True)

def replace_file(file, replace_fn):
    text = ''
    with open(file, 'r') as f:
        text = f.read()

    new_text = replace_fn(text)
    with open(file, 'w') as f:
        f.write(new_text)

def replace_files(files, replace_fn):
    for f in files:
        replace_file(f, replace_fn)

def replace_inner_fn(file_text, fn_name, replace_fn):
    def regex_replace(match):
        fn_def, inner = match.group(1), match.group(2)
        if inner.strip().startswith('"""'):
            return fn_def + re.sub(r'(\"\"\"[\s\S]*\"\"\"\n)([\s\S]*)',
                lambda m: m.group(1) + replace_fn(m.group(2)), inner, flags=re.M)
        else:
            return fn_def + replace_fn(inner)

    return re.sub(r'(def {}.*:\n)((?:[\n]*    .*\n)*)'
        .format(fn_name), regex_replace, file_text, flags=re.M)

def remove_yield(inner_fn_text):
    return '    _yield_list = []\n' \
        + re.sub(r'yield (.*)', r'_yield_list.append(\1)', inner_fn_text) \
        + '    return iter(_yield_list)\n'

INDENT = '    '

def replace_inner_indent(text, pre_indent_line, replace_indent_fn):
    def regex_replace(match):
        indent = match.group(1) + INDENT
        return re.sub(r'(.*\n)((?:' + indent + r'.*\n)*)',
            lambda m: m.group(1) + replace_indent_fn(m.group(2), indent), match.group(0), count=1)

    return re.sub(r'( *)' + pre_indent_line + r'\n(?: .*\n)*', regex_replace, text, flags=re.M)
