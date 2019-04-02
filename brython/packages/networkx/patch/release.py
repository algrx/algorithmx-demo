# Version information
name = 'networkx'

# Declare current release as a development release.
# Change to False before tagging a release; then change back.
dev = False


description = "Python package for creating and manipulating graphs and networks"

long_description = \
    """
NetworkX is a Python package for the creation, manipulation, and
study of the structure, dynamics, and functions of complex networks.

"""
license = 'BSD'
authors = {'Hagberg': ('Aric Hagberg', 'hagberg@lanl.gov'),
           'Schult': ('Dan Schult', 'dschult@colgate.edu'),
           'Swart': ('Pieter Swart', 'swart@lanl.gov')}
maintainer = "NetworkX Developers"
maintainer_email = "networkx-discuss@googlegroups.com"
url = 'http://networkx.github.io/'
download_url = 'https://pypi.python.org/pypi/networkx/'
platforms = ['Linux', 'Mac OSX', 'Windows', 'Unix']
keywords = ['Networks', 'Graph Theory', 'Mathematics',
            'network', 'graph', 'discrete mathematics', 'math']
classifiers = [
    'Development Status :: 5 - Production/Stable',
    'Intended Audience :: Developers',
    'Intended Audience :: Science/Research',
    'License :: OSI Approved :: BSD License',
    'Operating System :: OS Independent',
    'Programming Language :: Python :: 2',
    'Programming Language :: Python :: 2.7',
    'Programming Language :: Python :: 3',
    'Programming Language :: Python :: 3.4',
    'Programming Language :: Python :: 3.5',
    'Programming Language :: Python :: 3.6',
    'Topic :: Software Development :: Libraries :: Python Modules',
    'Topic :: Scientific/Engineering :: Bio-Informatics',
    'Topic :: Scientific/Engineering :: Information Analysis',
    'Topic :: Scientific/Engineering :: Mathematics',
    'Topic :: Scientific/Engineering :: Physics']

from .version import date, date_info, version, version_info, vcs_info
