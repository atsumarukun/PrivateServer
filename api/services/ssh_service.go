package services

import (
	"fmt"
	"io/ioutil"
	"golang.org/x/crypto/ssh"

	"api/conf"
)

type SshService struct{}

func (_ SshService) Run(command string) error {
	buf, err := ioutil.ReadFile("/go/src/api/PrivateServer")
	if err != nil {
		return err
	}
	key, err := ssh.ParsePrivateKey(buf)
	if err != nil {
		return err
	}
	config := &ssh.ClientConfig{
        User: conf.User,
        Auth: []ssh.AuthMethod{
			ssh.PublicKeys(key),
        },
		HostKeyCallback: ssh.InsecureIgnoreHostKey(),
    }
	client, err := ssh.Dial("tcp", fmt.Sprintf("%s:%s", conf.Host, conf.Port), config)
	if err != nil {
		return err
	}
	session, err := client.NewSession()
	if err != nil {
		return err
	}
	defer session.Close()
	if err := session.Run(command); err != nil {
		return err
	}

	return nil
}