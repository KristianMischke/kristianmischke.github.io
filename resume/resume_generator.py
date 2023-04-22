from jinja2 import Environment, FileSystemLoader
import os
import subprocess
import yaml

def generate_resume(tag: str, data: dict):
    # get original templated latex file
    with open('./resume_template.tex') as f:
        template_doc = f.read()

    template_doc = template_doc.replace('<<resume_flavor>>', tag)

    # run template and output progress to file
    output = Environment(
        block_start_string='(((',
        block_end_string=')))',
        variable_start_string='((',
        variable_end_string='))',
        comment_start_string='((#',
        comment_end_string='#))',
        trim_blocks=True,
        loader=FileSystemLoader("")
    ).from_string(template_doc).render(data)

    filename_base = f'{tag}_output'
    with open(f'./{filename_base}.tex', 'w') as f:
        f.write(output)


    # build pdf
    cmd = ['pdflatex', '-interaction', 'nonstopmode', f'./{filename_base}.tex']
    proc = subprocess.Popen(cmd)
    proc.communicate()

    retcode = proc.returncode
    if not retcode == 0:
        os.unlink(f'{filename_base}.pdf')
        raise ValueError('Error {} executing command: {}'.format(retcode, ' '.join(cmd)))
    os.unlink(f'{filename_base}.aux')
    os.unlink(f'{filename_base}.log')

    return os.path.join(os.path.dirname(os.path.abspath(__file__)), f'{filename_base}.pdf')


def main():
    # get resume data
    with open('../_data/resume-cv.yml', encoding='utf8') as file:
        resume_data = yaml.load(file, Loader=yaml.FullLoader)

    resume_flavors = ['resume', 'resume_ml', 'resume_games']

    for flavor in resume_flavors:
        result_pdf_path = generate_resume(flavor, resume_data)
        print(result_pdf_path)

        # open to view file
        os.system(f'cmd /c {result_pdf_path}')

if __name__ == '__main__':
    main()
