from jinja2 import Environment, FileSystemLoader
import os
import subprocess
import yaml


def main():
    # get resume data
    with open('../_data/resume-cv.yml', encoding='utf8') as file:
        resume_data = yaml.load(file, Loader=yaml.FullLoader)

    # get original templated latex file
    with open('./resume_template.tex') as f:
        template_doc = f.read()

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
    ).from_string(template_doc).render(resume_data)
    with open('./resume_output.tex', 'w') as f:
        f.write(output)

    # build pdf
    cmd = ['pdflatex', '-interaction', 'nonstopmode', './resume_output.tex']
    proc = subprocess.Popen(cmd)
    proc.communicate()

    retcode = proc.returncode
    if not retcode == 0:
        os.unlink('resume_output.pdf')
        raise ValueError('Error {} executing command: {}'.format(retcode, ' '.join(cmd)))
    os.unlink('resume_output.aux')
    os.unlink('resume_output.log')

    # open to view file
    result_pdf_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'resume_output.pdf')
    print(result_pdf_path)
    os.system(f'cmd /c {result_pdf_path}')


if __name__ == '__main__':
    main()
