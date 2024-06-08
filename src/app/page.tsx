"use client"

import React, {useState, useEffect} from 'react';
import Image from "next/image";
import Link from "next/link";
import moment from "moment";

import {
  BsHouse,
  BsReceipt,
  BsGraphUp,
  BsBox,
  BsGear,
  BsBoxArrowLeft,
  BsBell,
  BsPersonCircle,
  BsArrowUpRight,
  BsArrowDownRight,
  BsChevronDown
} from 'react-icons/bs'

import ApiCall from '@/helper/api-call';
import { Slide } from "react-awesome-reveal";

export default function Home() {

  useEffect(() => {
   getProducts()
  }, []);

  const api = new ApiCall();

  type Product = {
    id: number,
    title: string,
    description: string,
    category: string,
    price: string,
    images: [string],
  }

  const [products, setProduct] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filterBy, setFilterBy] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('')

  const categories : string [] = ['beauty', 'fragrances', 'furniture', 'groceries'];

  type getProductsFunc = () => void
  const getProducts : getProductsFunc =  async () => {
    const fetched = await api.get('products')
    setProduct(fetched.products);
    setFilteredProducts(fetched.products);
    console.log(fetched)
  }

  type onFilterByProp = (event: React.ChangeEvent<HTMLSelectElement>) => void

  type FilterBy = 'beauty' | 'fragrances' | 'furniture' | 'groceries' | '';

  const onFilterBy : onFilterByProp = (event) => {
    const selectedCriteria = event.target.value as FilterBy;
    setFilterBy(selectedCriteria);

    if ( selectedCriteria === '' ) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter((product)=>product.category === selectedCriteria);

    setFilteredProducts(filtered);    
  };

  type sortPriceFunc = (event: React.ChangeEvent<HTMLSelectElement>) => void
  
  type SortBy = '' | 'highest' | 'lowest';

  const sortOptions : string [] = ['highest', 'lowest'];

  const sortPrice : sortPriceFunc = (event) => {
    const selectedCriteria = event.target.value as SortBy;
    setSortBy(selectedCriteria);
    
    if ( selectedCriteria === '' ) setFilteredProducts(filteredProducts);

    if ( selectedCriteria === 'lowest' ){
        setFilteredProducts(filteredProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price)));
    }

    if ( selectedCriteria === 'highest' ){
      setFilteredProducts(filteredProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price)));
    }
  }
  
  type numberWithCommasProp = (input:string) => string
  const numberWithCommas : numberWithCommasProp = (input) => {
    let number = parseFloat(input);
  
    let hasDecimal = input.toString().split('').indexOf('.') !== -1;

    if (!hasDecimal) {
      input += '.00';
      number = parseFloat(input);
    }
  
    let parts = input.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  
    return parts.join('.');
  }

  return (
    <div className='container text-gray-900'>
      <div>
        <h1 className='md:text-[5em] uppercase text-[1.5em]'>Our Products</h1>
        <div className='mt-5 flex space-x-2'>
            <label className='text-gray-900 px-3 font-light text-sm py-2 rounded-full border w-[200px] h-[35px] bg-white relative flex items-center cursor-pointer'>
              <select value={filterBy} onChange={onFilterBy}
                      className='border-none appearance-none bg-transparent outline-none uppercase cursor-pointer absolute w-full h-full'>
                  <option value={''}>filter by</option>
                  {categories.map((category, index)=>(
                    <option key={index} value={category}>{category}</option>
                  ))}
              </select>
              <div className='text-gray-900 absolute right-2'><BsChevronDown/></div>
            </label>
            <label className='text-gray-900 px-3 font-light text-sm py-2 rounded-full border w-[200px] h-[35px] bg-white relative flex items-center cursor-pointer'>
              <select value={sortBy} onChange={sortPrice}
                      className='border-none appearance-none bg-transparent outline-none uppercase cursor-pointer absolute w-full h-full'>
                  <option value={''}>sort by</option>
                  {sortOptions.map((option, index)=>(
                    <option key={index} value={option}>{option}</option>
                  ))}
              </select>
              <div className='text-gray-900 absolute right-2'><BsChevronDown/></div>
            </label>
        </div>
      </div>
        <hr className='my-5 border-gray-400'/>
        <Slide>
          <div className='grid md:grid-cols-4 gap-y-5 gap-x-5'>
              {filteredProducts?.map((product, key)=>(
                <div key={key}>
                <div className='h-[20em] bg-gray-200 overflow-hidden'>
                  <Image src={product.images[0]} alt={product.title} width={'300'} height={'300'} />
                </div>
                <div className='mt-5'>
                  <h2 className='font-medium uppercase'>{product.title}</h2>
                  <p className='font-light uppercase text-xs my-2 p-2 border rounded-full'>{product.category}</p>
                  <p className='text-gray-500 font-light mt-2'>N {numberWithCommas(product.price)}</p>
                </div>
              </div>
              ))}
          </div>
        </Slide>
    </div>
  );
}
