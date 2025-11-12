import React, { useState } from 'react';
import { Carousel, CarouselItem, CarouselIndicators, CarouselCaption } from 'reactstrap';

const items = [
    {
        src: '/img/peace-of-mind.jpg',
        altText: '< Peace Of Mind - Everything In Place >',
        captionheader: '< Peace Of Mind - Everything In Place >',
        caption: 'If you are ever unhappy we will refund your money if you are unhappy with our service. 30 day money back guarantee for the lifetime of your account. No hidden charges or surprises.'
    },
    {
        src: '/img/multi-language.jpg',
        altText: '< Multi-Language / Auto Translate >',
        captionheader: '< Multi-Language / Auto Translate >',
        caption: 'Send your campaigns in the language of your choice. Allow your members to view the campaign in the language of their choice.'
    },
    {
        src: '/img/market-sell-more.jpg',
        altText: '< Market & Sell More - Pay Less $$ >',
        captionheader: '< Market & Sell More - Pay Less $$ >',
        caption: 'Increase your ROI which drives more sales, costs you less and increase your profits.'
    },
    {
        src: '/img/shopping-cart-integration.jpg',
        altText: '< Shopping Cart Integration >',
        captionheader: '< Shopping Cart Integration >',
        caption: 'Do you sell a product?  Do you have a shopping card provider such as Shopify? Directly link your account and sell directly to your customers with your products and prices with no add on charges like other email providers.'
    },
    {
        src: '/img/flexible-billing.jpg',
        altText: '< Flexible Billing >',
        captionheader: '< Flexible Billing >',
        caption: 'Only send an SMS Campaign, Email Campaign or Survey a few times a year? Why pay every month like the other providers require.  We support Pay as you Go so you are only pay for what you use. No monthly fees or commitments.'
    },
    {
        src: '/img/innovative-products.jpg',
        altText: '< Intergrated Products >',
        captionheader: '< Intergrated Products >',
        caption: 'Emails in any language. High Quality Surveys in any Style, SMS Campaigns and SMS Polls. High End Secure Forms that can store sensitive information, Lead Generating Assessments, Social Media Posting.  It all is here. Increase your online presence today.'
    }
];

const CorousealsComponent = (props) => {
    const randomIndex=Math.floor(Math.random() * items.length);
    const [activeIndex, setActiveIndex] = useState(randomIndex);
    const [animating, setAnimating] = useState(false);

    const next = () => {
        if (animating) return;
        const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
        setActiveIndex(nextIndex);
    }

    const previous = () => {
        if (animating) return;
        const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
        setActiveIndex(nextIndex);
    }

    const goToIndex = (newIndex) => {
        if (animating) return;
        setActiveIndex(newIndex);
    }

    const slides = items.map((item) => {
        return (
            <CarouselItem
                onExiting={() => setAnimating(true)}
                onExited={() => setAnimating(false)}
                key={item.src}
                className="text-center"
            >
                <img className='sliderimage' src={item.src} alt={item.altText} />
                <CarouselCaption captionText={item.caption} captionHeader={item.captionheader} />
            </CarouselItem>
        );
    });

    return (
        <Carousel
            activeIndex={activeIndex}
            next={next}
            previous={previous}
            ride={"carousel"}
            interval={"4000"}
        >
            <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={goToIndex} />
            {slides}
        </Carousel>
    );
}

export default CorousealsComponent;