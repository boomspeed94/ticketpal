import React, { useState } from 'react';
import { hot } from 'react-hot-loader/root';
import { Layout } from 'components/templates/layout';
import { Section } from 'components/organisms/section';
import { Form, Formik } from 'formik';
import { Categories, createSchema, initialValue } from 'components/pages/create/form';
import { Heading } from 'components/molecules/heading';
import { Fieldrow } from 'components/molecules/fieldrow';
import { TextFieldFormik } from 'components/atoms/textfield';
import { FileInput } from 'components/atoms/fileinput';
import { Textarea } from 'components/atoms/textarea';
import { Productcard } from 'components/organisms/productCard';
import { Button } from 'components/atoms/button';
import { ButtonContainer } from 'components/molecules/buttonContainer';
import { MultiSelect } from 'components/atoms/multiselect';
import { createEvent } from 'services/ICONService';
import { Modal } from 'components/organisms/modal';
import { ModalHeader } from 'components/molecules/modalHeader';
import { Spinner } from 'components/atoms/spinner';
import { toast } from 'react-toastify';

export const Create: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="p-create">
      <Layout title="Create Event">
        <Section className="p-create_main">
          <Heading>Create an event</Heading>
          <Formik
            initialValues={initialValue}
            validationSchema={createSchema}
            onSubmit={values => {
              if (localStorage.getItem('token')) {
                createEvent(values, localStorage.getItem('ADDRESS'), setModalOpen);
              } else {
                toast.error('You need to login first!');
              }
            }}
            validateOnMount
          >
            {({ values, isValid, setTouched, touched }) => {
              const previewSrc = URL && values.file ? URL.createObjectURL(values.file) : '';
              const previewType = values.file && values.file.type;
              return (
                <Form className="p-create_form">
                  <div className="p-create_inputs">
                    <Fieldrow name="file">
                      <FileInput
                        name="file"
                        label="PNG, GIF, JPG, JPEG"
                        setTouched={() => !touched.file && setTouched({ ...touched, file: true })}
                      />
                    </Fieldrow>
                    <Fieldrow fieldName="Event name" name="name">
                      <TextFieldFormik name="name" placeholder="Name of event" />
                    </Fieldrow>
                    <Fieldrow fieldName="Event path" name="eventPath">
                      <TextFieldFormik name="eventPath" placeholder="Event path" />
                    </Fieldrow>
                    <Fieldrow fieldName="Organizer" name="organizer">
                      <TextFieldFormik name="organizer" placeholder="Organizer" />
                    </Fieldrow>
                    <Fieldrow fieldName="Category" name="categories">
                      {typeof window !== `undefined` && (
                        <MultiSelect
                          options={Categories}
                          selectedValues={values.categories}
                          name="categories"
                          onBlur={() => !touched.categories && setTouched({ ...touched, categories: true })}
                        />
                      )}
                    </Fieldrow>
                    <Fieldrow fieldName="Location" name="location">
                      <TextFieldFormik name="location" placeholder="Location" />
                    </Fieldrow>
                    <div className="horizol">
                      <Fieldrow fieldName="Start Day" name="startDay">
                        <TextFieldFormik type="datetime-local" name="startDay" placeholder="Will be a calendar later" />
                      </Fieldrow>
                      <Fieldrow fieldName="End Day" name="endDay">
                        <TextFieldFormik type="datetime-local" name="endDay" placeholder="Will be a calendar later" />
                      </Fieldrow>
                    </div>
                    <div className="horizol">
                      <Fieldrow fieldName="Ticket Price (in ICX)" name="price">
                        <TextFieldFormik type="tel" name="price" placeholder="Price in ICX" />
                      </Fieldrow>
                      <Fieldrow fieldName="Available quantity" name="quantity">
                        <TextFieldFormik type="tel" name="quantity" placeholder="Number of ticket" />
                      </Fieldrow>
                    </div>
                    <Fieldrow fieldName="Description">
                      <Textarea name="description" placeholder="Desc" maxLength={500} />
                    </Fieldrow>
                    <ButtonContainer>
                      <Button type="button" modifiers="bid" anchor={{ href: '/' }}>
                        Back
                      </Button>
                      <Button type="submit" modifiers="buy" disabled={!isValid}>
                        Create
                      </Button>
                    </ButtonContainer>
                  </div>
                  <div className="p-create_review">
                    <div className="p-create_reviewbox">
                      <Productcard
                        name={values.name || ''}
                        price={values.price || 0}
                        location={values.location || ''}
                        organizer={values.organizer || ''}
                        imageUrl={previewSrc}
                        mediaType={previewType}
                        // collection={values.collection}
                        alt=""
                        isPreview
                      />
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </Section>
        <Modal isOpen={modalOpen} handleClose={() => {}}>
          <ModalHeader title="" cannotClose={true} />
          <div className="p-create_center">
            <Spinner modifiers="big" />
          </div>
          <div className="p-create_center p-create_waiting"> Please wait a moment.</div>
        </Modal>
      </Layout>
    </div>
  );
};

export default hot(Create);
