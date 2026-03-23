import os

def escape_unicode(text):
    #"""Convierte todos los caracteres fuera de ASCII a \uXXXX"""
    return ''.join(
        f'\\u{ord(c):04x}' if ord(c) > 127 else c
        for c in text
    )

# Carpeta raíz de los idiomas (donde están en/, fr/, es/)
lang_root = "."  # si el script está dentro de Languages/

for lang_folder in os.listdir(lang_root):
    folder_path = os.path.join(lang_root, lang_folder)
    if os.path.isdir(folder_path):
        noscaped_file = os.path.join(folder_path, "Lang.NOSCAPED.js")
        lang_file = os.path.join(folder_path, "Lang.js")
        
        if os.path.isfile(noscaped_file):
            # Leer el archivo original UTF-8
            with open(noscaped_file, "r", encoding="utf-8") as f:
                content = f.read()
            
            # Escapar caracteres
            escaped = escape_unicode(content)
            
            # Escribir el archivo Lang.js escapado
            with open(lang_file, "w", encoding="utf-8") as f:
                f.write(escaped)
            
            print(f"✅ {lang_folder}: Lang.js generado a partir de Lang.NOSCAPED.js")
