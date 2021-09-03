

type HTMLAttributes = React.HTMLAttributes<HTMLDivElement> 

const Page: React.FC<HTMLAttributes> = ({ children, ...rest }) => {
  return (
      <div {...rest}>{children}</div>
  );
};

export default Page
