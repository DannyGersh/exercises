import smtplib
import secrets
from email.mime.text import MIMEText

secretsGenerator = secrets.SystemRandom()

def email_genPass():
	a = secretsGenerator.randint(0, 9)
	b = secretsGenerator.randint(0, 9)
	c = secretsGenerator.randint(0, 9)
	d = secretsGenerator.randint(0, 9)
	return '%s%s%s%s'%(a,b,c,d)
	
def email_send(subject, body, sender, recipients, password):
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = sender
    msg['To'] = ', '.join(recipients)
    smtp_server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
    smtp_server.login(sender, password)
    smtp_server.sendmail(sender, recipients, msg.as_string())
    smtp_server.quit()
