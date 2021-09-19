# Enantiom CLI options

```text
Usage: enantiom run [options]

Options:
  -c, --config <path>  Path to config file
  -v, --verbose        Increase verbosity (allow multiple)
  --no-html            Disable HTML report and output JSON only
  --fail-in-diff       CLI fails when diff exists
  -h, --help           display help for command
```

## --config <path>

**short option (-c)**  
Path to `enantiom.config.json`.  
Allow both of path: absolute or relative from current directory.

## --verbose (optional)

**short option (-v)**  
**multiple allowed (-vvv)**  
Output more verbose log.  
If set multiple times, output more verbose logs.

## --no-html (optional)

Disable HTML report and output JSON only.  
JSON report will be placed to `<artifact_path>/assets/state.json`

## --fail-in-diff (optional)

CLI fails when diff exists.

## --help (optional)

**short option (-h)**  
Show CLI help.
