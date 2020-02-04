import React from 'react';
import { FieldSet } from '../components/field-set/field-set';

export default {
  title: 'Form Elements',
  component: FieldSet
};

export const FieldSetDemo = () => (
  <div>
    <FieldSet legend="A legend">
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. 
      Officiis animi labore excepturi quidem tempore tenetur 
      reprehenderit voluptatibus quod atque molestias itaque 
      quia id mollitia, asperiores soluta alias. Unde, esse non!  
    </FieldSet>
  </div>
)
