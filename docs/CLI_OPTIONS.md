# Enantiom CLI options

## Run command

```text
Usage: enantiom run [options]

Options:
  -c, --config <path>  Path to config file
  -v, --verbose        Increase verbosity, opposite quiet option (allow multiple)
  -q, --quiet          Increase quietness, opposite verbose option (allow multiple)
  --no-html            Disable HTML report and output JSON only
  --fail-in-diff       CLI fails when diff exists
  -h, --help           display help for command
```

### --config <path>

**short option (-c)**  
Path to `enantiom.config.json`.  
Allow both of path: absolute or relative from current directory.

### --verbose (optional)

**short option (-v)**  
**multiple allowed (-vvv)**  
Output more verbose log.  
If set multiple times, output more verbose logs.

### --quiet (optional)

**short option (-q)**  
**multiple allowed (-qqq)**  
Set more quietness of logging messages.  
If set multiple times, output more serious logs only.

### --no-html (optional)

Disable HTML report and output JSON only.  
JSON report will be placed to `<artifact_path>/assets/state.json`

### --fail-in-diff (optional)

CLI fails when diff exists.

### --help (optional)

**short option (-h)**  
Show CLI help.


## Generate-region command

Generate ignoring pixel regions.  
It used for `diff_options.ignoreRegions` in enantiom.config.json

```text
Usage: enantiom generate-region [options]

Options:
  -f, --diff-file <path>  Path to diff file
  -v, --verbose           Increase verbosity, opposite quiet option (allow multiple)
  -q, --quiet             Increase quietness, opposite verbose option (allow multiple)
  -h, --help              display help for command
```

### --diff-file <path>

**short option (-c)**  
Path to diff file that outputs color pixels as an ignoring regions.  
Allow both of path: absolute or relative from current directory.

### --verbose (optional)

**short option (-v)**  
**multiple allowed (-vvv)**  
Output more verbose log.  
If set multiple times, output more verbose logs.

### --quiet (optional)

**short option (-q)**  
**multiple allowed (-qqq)**  
Set more quietness of logging messages.  
If set multiple times, output more serious logs only.

### --help (optional)

**short option (-h)**  
Show CLI help.
