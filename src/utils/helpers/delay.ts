const delay = async (delayInMs = 3000) => {
    await new Promise(resolve => setTimeout(resolve, delayInMs));
};

export default delay;
