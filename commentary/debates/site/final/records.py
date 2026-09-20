import re, sys, json
KEY=re.compile(r'^([a-z][a-z0-9_-]*):(.*)$')
def parse(text):
    recs=[]; 
    for block in text.split('\n---\n'):
        fields=[]  # (key, value, style) style 'inline' or 'block'
        cur=None
        for line in block.split('\n'):
            m=KEY.match(line)
            if m and (cur is None or not (line.startswith(' '))):
                k,rest=m.group(1),m.group(2)
                if rest.startswith(' '): fields.append([k,rest[1:],'inline'])
                elif rest=='' : fields.append([k,'','block'])
                else: fields.append([k,rest,'inline'])
                cur=fields[-1]
            else:
                if cur is None: fields.append(['_pre',line,'raw']); cur=fields[-1]
                else: cur[1]=(cur[1]+'\n'+line) if cur[1]!='' or cur[2]!='block' else line
        recs.append(fields)
    return recs
def serialize(recs):
    out=[]
    for fields in recs:
        lines=[]
        for k,v,st in fields:
            if st=='raw': lines.append(v)
            elif st=='block': lines.append(k+':'); lines.append(v)
            else: lines.append(k+': '+v)
        out.append('\n'.join(lines))
    return '\n---\n'.join(out)
def apply(path, changes, log=print):
    text=open(path,encoding='utf-8').read()
    recs=parse(text)
    assert serialize(recs)==text, 'round-trip failed for '+path
    seen=set()
    for fields in recs:
        rid=next((v for k,v,s in fields if k=='id'),None)
        if rid in changes:
            seen.add(rid)
            for k,v in changes[rid].items():
                hit=False
                for f in fields:
                    if f[0]==k:
                        if f[1]!=v: log(f'{rid}.{k}: changed'); 
                        f[1]=v; hit=True
                if not hit: raise SystemExit(f'field {k} not in record {rid}')
    missing=set(changes)-seen
    if missing: raise SystemExit('ids not found: '+', '.join(sorted(missing)))
    open(path,'w',encoding='utf-8').write(serialize(recs))
    log(f'wrote {path}: {len(seen)} records changed')
def parse_rewrite(path, fmt):
    """fmt 'NEW' parses '## id' + 'field NEW: text'; fmt 'plain' parses '### id' + 'field: text' (single line)."""
    ch={}; rid=None
    for line in open(path,encoding='utf-8'):
        line=line.rstrip('\n')
        m=re.match(r'^##+ ([a-z0-9-]+)\s*$', line)
        if m: rid=m.group(1); continue
        if rid is None: continue
        if fmt=='NEW':
            m=re.match(r'^(what|note|trans|passage|title|body|intro) NEW: (.*)$', line)
        else:
            m=re.match(r'^(what|note|trans|passage|title|body|intro|who|when|label): (.*)$', line)
        if m: ch.setdefault(rid,{})[m.group(1)]=m.group(2)
    return ch
