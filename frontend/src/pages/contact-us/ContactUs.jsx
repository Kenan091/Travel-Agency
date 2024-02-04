import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import emailjs from '@emailjs/browser';
import styles from './ContactUs.module.css';
import { addFeedback } from '../../redux/feedback/feedbacksSlice';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import {
  IoTime,
  IoLocationSharp,
  IoCall,
  IoMail,
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoLinkedin,
} from 'react-icons/io5';

const ContactUs = () => {
  const form = useRef();

  const dispatch = useDispatch();
  // const feedbackList = useSelector(selectFeedbackList);

  const [feedbackData, setFeedbackData] = useState({
    user_name: '',
    user_email: '',
    user_phoneNumber: '',
    message: '',
  });

  // const sendEmail = e => {
  //   e.preventDefault();

  //   emailjs
  //     .sendForm(
  //       'service_3lzma29',
  //       'template_80r34fh',
  //       form.current,
  //       '6Hyj3d8cOnafn4BSu'
  //     )
  //     .then(
  //       result => {
  //         console.log(result.text);
  //         toast.success(
  //           "Your message has been successfully sent! We'll get back to you shortly"
  //         );
  //         e.target.reset();
  //       },
  //       error => {
  //         console.log(error.text);
  //         toast.error(error.text);
  //       }
  //     );
  // };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFeedbackData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (
      !feedbackData.user_name ||
      !feedbackData.user_email ||
      !feedbackData.user_phoneNumber ||
      !feedbackData.message
    ) {
      toast.error('Each field must be entered!');
      return;
    }
    dispatch(addFeedback(feedbackData));

    emailjs
      .sendForm(
        'service_3lzma29',
        'template_80r34fh',
        form.current,
        '6Hyj3d8cOnafn4BSu'
      )
      .then(
        result => {
          console.log(result.text);
          toast.success(
            "Your message has been successfully sent! We'll get back to you shortly"
          );
          e.target.reset();
        },
        error => {
          console.log(error.text);
          toast.error(error.text);
        }
      );

    setFeedbackData({
      user_name: '',
      user_email: '',
      user_phoneNumber: '',
      message: '',
    });
  };

  return (
    <>
      <div className={styles.headerDiv}>
        <Header />
      </div>
      <div className={styles.container}>
        <h2 className={styles.contactUsTitle}>Contact us</h2>
        <h3 className={styles.text}>
          Having questions, impressions or request? Feel free to send them!
        </h3>
        <div className={styles.customerSupport}>
          <div className={styles.details}>
            <h2 className={styles.mainTitle}>Customer support</h2>
            <div>
              <div className={styles.detailsDiv}>
                <IoTime
                  color='#83ab55'
                  size={32}
                />
                <p>9:00 - 16:00 (MON - SAT)</p>
              </div>
              <div className={styles.detailsDiv}>
                <IoLocationSharp
                  color='#83ab55'
                  size={32}
                />
                <p>Ul. Nepoznata bb, Zenica</p>
              </div>
              <div className={styles.detailsDiv}>
                <IoCall
                  color='#83ab55'
                  size={32}
                />
                <p>+387612345678</p>
              </div>
              <div className={styles.detailsDiv}>
                <IoMail
                  color='#83ab55'
                  size={32}
                />
                <p>travelist09@gmail.com</p>
              </div>
              <div className={styles.detailsDiv}>
                <IoLogoFacebook
                  color='#83ab55'
                  size={32}
                />
                <p>Travel group “Travelist”</p>
              </div>
            </div>
            <div className={styles.followUsDiv}>
              <h3 className={styles.title}>Follow us on</h3>
              <div className={styles.socials}>
                <IoLogoFacebook
                  color='#83ab55'
                  size={32}
                />
                <IoLogoInstagram
                  color='#83ab55'
                  size={32}
                />
                <IoLogoLinkedin
                  color='#83ab55'
                  size={32}
                />
              </div>
            </div>
          </div>
          <form
            ref={form}
            onSubmit={handleSubmit}
            className={styles.inputs}>
            <input
              type='text'
              name='user_name'
              onChange={handleInputChange}
              placeholder='Enter your full name'
            />
            <input
              type='email'
              name='user_email'
              onChange={handleInputChange}
              placeholder='Enter your email'
            />
            <input
              type='text'
              name='user_phoneNumber'
              onChange={handleInputChange}
              placeholder='Enter you phone number'
            />
            <textarea
              name='message'
              onChange={handleInputChange}
              placeholder='Enter your message'
            />
            <button
              type='submit'
              className={styles.contactSubmitButton}>
              Send
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactUs;
